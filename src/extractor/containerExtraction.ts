import LZMA from "@lib/lzma";
import BinaryReader from "@extractor/binaryReader";
import { readFile } from "./fileSystemAccess";
import { ClassID } from "./consts";
import { AssetInfo } from "./assetExtraction";
import { commonString } from "./consts";

interface ContainerData {
    container: string;
    name: string;
    assetInfos: Array<AssetInfo>;
    assetBytes: ArrayBuffer;
}

const extractContainerDatas = async (
    containerPaths: Array<string>,
    onProgress?: (index: number, total: number) => void
): Promise<Array<ContainerData>> => {
    const containerDatas: Array<ContainerData> = [];
    for (let i = 0; i < containerPaths.length; i++) {
        if (onProgress) {
            onProgress(i, containerPaths.length);
        }
        const containerData = await getContainerData(containerPaths[i]);
        containerDatas.push(containerData);
    }
    return containerDatas;
};

const getContainerData = async (containerPath: string): Promise<ContainerData> => {
    // Get the .unity3d file
    const containerFile = await getContainerFile(containerPath);
    let reader: BinaryReader = new BinaryReader(containerFile);
    // Container header
    const containerHeader = getContainerHeader(reader);
    if (containerHeader.signature !== "UnityRaw" && containerHeader.signature !== "UnityWeb") {
        throw new Error(`Signature: ${containerHeader.signature} is not supported.`);
    }
    // AssetFile bytes
    const blockBytes = await getBlockBytes(reader, containerHeader.signature);
    reader = new BinaryReader(blockBytes);
    const { assetFileBytes, name } = getAssetFileBytes(reader, blockBytes);
    reader = new BinaryReader(assetFileBytes);
    // AssetFile
    const assetFile = getAssetFile(reader);
    // AssetInfos
    const assetInfos: Array<AssetInfo> = [];
    for (const asset of assetFile) {
        reader.position = asset.byteStart;
        const assetName = getAssetName(reader, asset.classId);
        assetInfos.push({
            ...asset,
            name: assetName,
        });
    }

    return {
        container: containerPath,
        name: name,
        assetInfos: assetInfos,
        assetBytes: assetFileBytes,
    };
};

const getContainerFile = async (containerPath: string): Promise<ArrayBuffer> => {
    return await readFile("mobius_data/Hash/" + containerPath);
};

const getContainerHeader = (reader: BinaryReader) => {
    return {
        signature: reader.readStringToNull(),
        version: reader.readU32(),
        unityVersion: reader.readStringToNull(),
        unityRevision: reader.readStringToNull(),
    };
};

const getBlockBytes = async (reader: BinaryReader, signature: string): Promise<ArrayBuffer> => {
    reader.position += 20;
    const uncompressedSize = reader.readU32();
    reader.position = 60;
    const uncompressedBytes = reader.readBytes(uncompressedSize);
    if (signature === "UnityWeb") {
        const data = await LZMA.decompress(new Uint8Array(uncompressedBytes));
        return Uint8Array.from(data).buffer;
    } else {
        return uncompressedBytes;
    }
};

const getAssetFileBytes = (
    reader: BinaryReader,
    blockBytes: ArrayBuffer
): { assetFileBytes: ArrayBuffer; name: string } => {
    reader.position += 4;
    const name = reader.readStringToNull();
    const offset = reader.readU32();
    reader.position += 4;
    return {
        assetFileBytes: blockBytes.slice(offset),
        name: name,
    };
};

interface TypeInfo {
    classId: number;
    nodes: Array<TypeNode>;
    stringBuffer: ArrayBuffer;
}
interface TypeNode {
    type: string;
    name: string;
    byteSize: number;
    index: number;
    isArray: boolean;
    version: number;
    metaFlag: number;
    level: number;
    typeStrOffset: number;
    nameStrOffset: number;
    // refTypeHash: unknown
}

interface ObjectInfoType {
    pathId: string;
    byteStart: number;
    byteSize: number;
    types: TypeInfo;
    classId: number;
}

const getAssetFile = (reader: BinaryReader): Array<ObjectInfoType> => {
    reader.position = 12;
    const dataOffset = reader.readU32();
    reader.isLittleEndian = true;
    reader.position = 33;

    const readString = (stringBufferReader: BinaryReader, value: number) => {
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

    // Types
    const typeInfos: Array<TypeInfo> = [];
    const typeCount = reader.readI32();
    for (let i = 0; i < typeCount; i++) {
        const classId = reader.readI32();
        if (classId < 0) {
            reader.position += 16;
        }
        reader.position += 16;

        const nodes: Array<TypeNode> = [];
        const numberOfNodes = reader.readI32();
        const stringBufferSize = reader.readI32();
        for (let j = 0; j < numberOfNodes; j++) {
            nodes.push({
                type: "",
                name: "",
                version: reader.readI16(),
                level: reader.readByte(),
                isArray: reader.readBoolean(),
                typeStrOffset: reader.readU32(),
                nameStrOffset: reader.readU32(),
                byteSize: reader.readI32(),
                index: reader.readI32(),
                metaFlag: reader.readI32(),
            });
        }
        const stringBuffer = reader.readBytes(stringBufferSize);
        const stringBufferReader = new BinaryReader(stringBuffer);
        for (let j = 0; j < numberOfNodes; j++) {
            nodes[j].type = readString(stringBufferReader, nodes[j].typeStrOffset);
            nodes[j].name = readString(stringBufferReader, nodes[j].nameStrOffset);
        }
        typeInfos.push({
            classId: classId,
            nodes: nodes,
            stringBuffer: stringBuffer,
        });
    }

    // Objects
    const objectCount = reader.readI32();
    const objectInfos: Array<ObjectInfoType> = [];
    for (let i = 0; i < objectCount; i++) {
        reader.align();
        const pathId = reader.readI64().toString();
        let byteStart = reader.readU32();
        byteStart += dataOffset;
        const byteSize = reader.readU32();
        const typeId = reader.readI32();
        const classId = reader.readU16();
        reader.position += 3;
        objectInfos.push({
            pathId: pathId,
            byteStart: byteStart,
            byteSize: byteSize,
            types: typeInfos.find((x) => x.classId === typeId) as TypeInfo,
            classId: classId,
        });
    }

    return objectInfos;
};

const getAssetName = (reader: BinaryReader, classId: number): string => {
    let name = "";
    switch (classId) {
        case ClassID.GameObject:
        case ClassID.Transform:
        case ClassID.MonoBehaviour:
        case ClassID.SkinnedMeshRenderer:
            break;
        default:
            name = reader.readAlignedString();
            break;
    }
    return name;
};

export { extractContainerDatas, getAssetName };
export type { TypeInfo, TypeNode };
