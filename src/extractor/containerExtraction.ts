import LZMA from "@lib/lzma";
import BinaryReader from "../pages/replica/extractor/extractor/binaryReader";
import { readFile } from "./fileSystemAccess";
import { commonString } from "../pages/replica/extractor/extractor/consts";

interface FullContainerData {
    containerPath: string;
    containerHeader: ContainerHeader;
    blockByteInfo: BlockBytesInfo;
    assetFileBytesInfo: AssetFileBytesInfo;
    assetFile: AssetFile;
}

const extractFullContainerData = async (containerPath: string): Promise<FullContainerData> => {
    // Get the .unity3d file
    const containerFile: ArrayBuffer = await readFile(containerPath);
    let reader: BinaryReader = new BinaryReader(new DataView(containerFile));
    // Container header
    const containerHeader = getFullContainerHeader(reader);
    if (containerHeader.signature !== "UnityRaw" && containerHeader.signature !== "UnityWeb") {
        throw new Error(`Signature: ${containerHeader.signature} is not supported.`);
    }
    // BlockBytes
    const { blockBytes, blockByteInfo } = await getFullBlockBytes(reader, containerHeader);
    reader = new BinaryReader(new DataView(blockBytes));
    // AssetFileBytes
    const { assetFileBytes, assetFileBytesInfo } = getFullAssetFileBytes(reader, blockBytes);
    reader = new BinaryReader(new DataView(assetFileBytes));
    // AssetFile
    const assetFile = getFullAssetFile(reader);

    return {
        containerPath: containerPath,
        containerHeader: containerHeader,
        blockByteInfo: blockByteInfo,
        assetFileBytesInfo: assetFileBytesInfo,
        assetFile: assetFile,
    };
};

interface ContainerHeader {
    signature: string;
    version: number;
    unityVersion: string;
    unityRevision: string;
}

const getFullContainerHeader = (reader: BinaryReader): ContainerHeader => {
    return {
        signature: reader.readStringToNull(),
        version: reader.readU32(),
        unityVersion: reader.readStringToNull(),
        unityRevision: reader.readStringToNull(),
    };
};

interface BlockBytesInfo {
    minimumStreamedBytes: number;
    abHeaderSize: number;
    numberOfLevelsToDownloadBeforeStreaming: number;
    levelCount: number;
    compressedSize: number;
    uncompressedSize: number;
    flags: number;
    completeFileSize: number;
    fileInfoHeaderSize: number;
}

interface BlockBytes {
    blockBytes: ArrayBuffer;
    blockByteInfo: BlockBytesInfo;
}

const getFullBlockBytes = async (
    reader: BinaryReader,
    abHeader: ContainerHeader
): Promise<BlockBytes> => {
    const minimumStreamedBytes = reader.readU32();
    const abHeaderSize = reader.readU32(); // Always 60
    const numberOfLevelsToDownloadBeforeStreaming = reader.readU32();
    const levelCount = reader.readI32(); // Always 1
    const compressedSize = reader.readU32();
    const uncompressedSize = reader.readU32();
    const flags = abHeader.signature === "UnityWeb" ? 1 : 0;
    const completeFileSize = reader.readU32();
    const fileInfoHeaderSize = reader.readU32();
    reader.position = abHeaderSize;

    // Decompress block
    let blockBytes = reader.readBytes(uncompressedSize);
    if (abHeader.signature === "UnityWeb") {
        const data = await LZMA.decompress(new Uint8Array(blockBytes));
        blockBytes = Uint8Array.from(data).buffer;
    }

    return {
        blockBytes: blockBytes,
        blockByteInfo: {
            minimumStreamedBytes: minimumStreamedBytes,
            abHeaderSize: abHeaderSize,
            numberOfLevelsToDownloadBeforeStreaming: numberOfLevelsToDownloadBeforeStreaming,
            levelCount: levelCount,
            compressedSize: compressedSize,
            uncompressedSize: uncompressedSize,
            flags: flags,
            completeFileSize: completeFileSize,
            fileInfoHeaderSize: fileInfoHeaderSize,
        },
    };
};

interface AssetFileBytesInfo {
    nodesCount: number;
    path: string;
    offset: number;
    size: number;
}

interface AssetFileBytes {
    assetFileBytes: ArrayBuffer;
    assetFileBytesInfo: AssetFileBytesInfo;
}

const getFullAssetFileBytes = (reader: BinaryReader, blockBytes: ArrayBuffer): AssetFileBytes => {
    // Asset file info
    const nodesCount = reader.readI32(); // Always 1
    const path = reader.readStringToNull();
    const offset = reader.readU32();
    const size = reader.readU32();
    return {
        assetFileBytes: blockBytes.slice(offset),
        assetFileBytesInfo: {
            nodesCount: nodesCount,
            path: path,
            offset: offset,
            size: size,
        },
    };
};

interface TypeTreeNode {
    type: string | null;
    name: string | null;
    byteSize: number;
    index: number;
    isArray: boolean;
    version: number;
    metaFlag: number;
    level: number;
    typeStrOffset: number;
    nameStrOffset: number;
}

interface Types {
    classId: number;
    scriptTypeIndex: number;
    nodes: Array<TypeTreeNode>;
    scriptId: ArrayBuffer | null;
    oldTypeHash: ArrayBuffer;
}

interface ObjectInfos {
    byteStart: number;
    byteSize: number;
    typeId: number;
    classId: number;
    stripped: ArrayBuffer;
    pathId: bigint;
}

interface Scripts {
    localSerializedFileIndex: number;
    localIdentifierInFile: bigint;
}

interface Externals {
    guid: ArrayBuffer;
    type: number;
    pathName: string;
    fileName: string;
}

interface AssetFile {
    header: {
        metaDataSize: number;
        fileSize: number;
        version: number;
        dataOffset: number;
        endianess: ArrayBuffer;
        reserved: ArrayBuffer;
    };
    version: [5, 0, 1, 2];
    buildType: "p";
    unityVersion: string;
    targetPlatform: number;
    enableTypeTree: boolean;
    types: Array<Types>;
    objectInfos: Array<ObjectInfos>;
    scriptTypes: Array<Scripts>;
    externals: Array<Externals>;
    userInformation: string;
}

const getFullAssetFile = (reader: BinaryReader): AssetFile => {
    const readString = (stringBufferReader: BinaryReader, value: number | null): string => {
        if (value === null) {
            return "";
        }
        const isOffset = (value & 0x80000000) === 0;
        if (isOffset) {
            stringBufferReader.position = value;
            return stringBufferReader.readStringToNull();
        }
        const offset = value & 0x7fffffff;
        if (commonString[offset] !== undefined) {
            return commonString[offset];
        }
        return offset.toString();
    };

    const metaDataSize = reader.readU32();
    const fileSize = reader.readU32();
    const version = reader.readU32();
    const dataOffset = reader.readU32();
    const endianess = reader.readByte();
    const reserved = reader.readBytes(3);
    reader.isLittleEndian = true;
    const unityVersion = reader.readStringToNull(); // Always 5.0.1p2
    const targetPlatform = reader.readI32(); // Always 5 (Windows)
    const enableTypeTree = reader.readBoolean(); // Always true

    // Types
    const typeCount = reader.readI32();
    const types: Array<Types> = [];
    for (let i = 0; i < typeCount; i++) {
        const classId = reader.readI32();
        let scriptId = null;
        if (classId < 0) {
            scriptId = reader.readBytes(16); //hash128
        }
        const oldTypeHash = reader.readBytes(16); //hash128

        const typeTree: Array<TypeTreeNode> = [];
        const numberOfNodes = reader.readI32();
        const stringBufferSize = reader.readI32();
        for (let j = 0; j < numberOfNodes; j++) {
            const version = reader.readU16();
            const level = reader.readU8();
            const isArray = reader.readBoolean();
            const typeStrOffset = reader.readU32();
            const nameStrOffset = reader.readU32();
            const byteSize = reader.readI32();
            const index = reader.readI32();
            const metaFlag = reader.readI32();
            typeTree.push({
                type: null,
                name: null,
                byteSize: byteSize,
                index: index,
                isArray: isArray,
                version: version,
                metaFlag: metaFlag,
                level: level,
                typeStrOffset: typeStrOffset,
                nameStrOffset: nameStrOffset,
            });
        }
        const stringBuffer = reader.readBytes(stringBufferSize);
        const stringBufferReader = new BinaryReader(new DataView(stringBuffer));
        for (let j = 0; j < numberOfNodes; j++) {
            typeTree[j].type = readString(stringBufferReader, typeTree[j].typeStrOffset);
            typeTree[j].name = readString(stringBufferReader, typeTree[j].nameStrOffset);
        }
        types.push({
            classId: classId,
            scriptTypeIndex: -1,
            nodes: typeTree,
            scriptId: scriptId,
            oldTypeHash: oldTypeHash,
        });
    }

    // Objects
    const objectCount = reader.readI32();
    const objectInfos: Array<ObjectInfos> = [];
    for (let i = 0; i < objectCount; i++) {
        reader.align();
        const pathId = reader.readI64();
        let byteStart = reader.readU32();
        byteStart += dataOffset;
        const byteSize = reader.readU32();
        const typeId = reader.readI32();
        const classId = reader.readU16();
        // objectInfo.serializedType = types.filter((x) => x.classId === objectInfo.typeId);
        // const scriptTypeIndex = reader.readI16();
        reader.readI16();
        // if (objectInfo.serializedType != null) {
        //     objectInfo.serializedType.scriptTypeIndex = scriptTypeIndex;
        // }
        const stripped = reader.readByte();
        objectInfos.push({
            byteStart: byteStart,
            byteSize: byteSize,
            typeId: typeId,
            classId: classId,
            stripped: stripped,
            pathId: pathId,
        });
    }

    // Scripts
    const scriptCount = reader.readI32();
    const scriptTypes: Array<Scripts> = [];
    for (let i = 0; i < scriptCount; i++) {
        const localSerializedFileIndex = reader.readI32();
        reader.align();
        const localIdentifierInFile = reader.readI64();
        scriptTypes.push({
            localSerializedFileIndex: localSerializedFileIndex,
            localIdentifierInFile: localIdentifierInFile,
        });
    }

    // Externals
    const externalsCount = reader.readI32();
    const externals: Array<Externals> = [];
    for (let i = 0; i < externalsCount; i++) {
        // const tempEmpty = reader.readStringToNull();
        reader.readStringToNull();
        const guid = reader.readBytes(16);
        const type = reader.readI32();
        const pathName = reader.readStringToNull();
        const fileNamePieces = pathName.split("/");
        const fileName = fileNamePieces[fileNamePieces.length - 1];
        externals.push({
            guid: guid,
            type: type,
            pathName: pathName,
            fileName: fileName,
        });
    }
    const userInformation = reader.readStringToNull();

    return {
        header: {
            metaDataSize: metaDataSize,
            fileSize: fileSize,
            version: version,
            dataOffset: dataOffset,
            endianess: endianess,
            reserved: reserved,
        },
        version: [5, 0, 1, 2],
        buildType: "p",
        unityVersion: unityVersion,
        targetPlatform: targetPlatform,
        enableTypeTree: enableTypeTree,
        types: types,
        objectInfos: objectInfos,
        scriptTypes: scriptTypes,
        externals: externals,
        userInformation: userInformation,
    };
};

export { extractFullContainerData };
export type { FullContainerData };
