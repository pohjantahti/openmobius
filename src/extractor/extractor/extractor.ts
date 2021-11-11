import BinaryReader from "./binaryReader";
import { getResourceAsBlobURL, getTextureInfo } from "./fileCreator";
import { readFile } from "./fileSystemAccess";
import containers from "../../data/resources/containers.json";
import LZMA from "../lzma";
import type { ResourceInfo, TextureInfo } from "./types";

const getResourceInfo = async (resource: string): Promise<ResourceInfo> => {
    const type = resource.split(":")[0];
    let jsonFile;
    switch (type) {
        case "Icon":
            jsonFile = "icons.json";
            break;
        case "Card":
            jsonFile = "cards.json";
            break;
        case "Music":
            jsonFile = "music.json";
            break;
        case "Thumbnail":
            jsonFile = "thumbnails.json";
            break;
        case "Billboard":
            jsonFile = "billboard.json";
            break;
        case "Regionmap":
            jsonFile = "regionmap.json";
            break;
        default:
            jsonFile = "resources.json";
            break;
    }
    const file: Array<ResourceInfo> = Object.values(
        await import("../../data/resources/" + jsonFile)
    );
    return file.filter((item: any) => item.alias === resource)[0];
};

const getGameData = async (resource: string, searchId?: number) => {
    const args = resource.split(": ");
    let dataFile;
    switch (args[0]) {
        case "Card":
            dataFile = "cards.ts";
            break;
        case "Job":
            dataFile = "jobs.ts";
            break;
        case "Region":
            dataFile = "regions.ts";
            break;
        default:
            console.error("Unknown game data type: ", resource, searchId);
            break;
    }
    const data: { default: Array<any> } = await import("../../data/game/" + dataFile);
    if (args[1]) {
        return data.default.filter((item: any) => item.name === args[1])[0];
    } else if (searchId! >= 0) {
        return data.default.filter((item: any) => item.id === searchId)[0];
    } else {
        return data.default;
    }
};

const extractResourceAsURL = async (resourceInfo: ResourceInfo): Promise<string> => {
    const [reader, assetFile] = await extractResourceFile(resourceInfo);
    return getResourceAsBlobURL(reader, assetFile, resourceInfo);
};

const extractResourceAsTextureInfo = async (resourceInfo: ResourceInfo): Promise<TextureInfo> => {
    const [reader, assetFile] = await extractResourceFile(resourceInfo);
    return getTextureInfo(reader, assetFile, resourceInfo);
};

// Core function of this file
const extractResourceFile = async (resourceInfo: ResourceInfo): Promise<[BinaryReader, {}]> => {
    // Load the .unity3d file
    const assetBundle: ArrayBuffer = await getAssetBundle(resourceInfo.container);
    let reader: BinaryReader = new BinaryReader(new DataView(assetBundle));
    // .unity3d header
    const abHeader = getAssetBundleHeaderInfo(reader);
    if (abHeader.signature !== "UnityRaw" && abHeader.signature !== "UnityWeb") {
        console.error(
            `File with a signature of "${abHeader.signature}" is not supported`,
            resourceInfo
        );
        throw new Error(`Signature: ${abHeader.signature} is not supported.`);
    }
    const blockBytes = await getBlockBytes(reader, abHeader);
    reader = new BinaryReader(new DataView(blockBytes));

    const assetFileBytes = getAssetFileBytes(reader, blockBytes);
    reader = new BinaryReader(new DataView(assetFileBytes));
    const assetFile = getAssetFile(reader);

    return [reader, assetFile];
};

const getAssetBundle = async (container: string): Promise<ArrayBuffer> => {
    const assetBundlePath: string = (containers as any)[container];
    if (assetBundlePath === undefined) {
        console.error("container erro", container);
    }
    return await readFile(assetBundlePath);
};

const getAssetBundleHeaderInfo = (reader: BinaryReader) => {
    return {
        signature: reader.readStringToNull(),
        version: reader.readU32(),
        unityVersion: reader.readStringToNull(),
        unityRevision: reader.readStringToNull(),
    };
};

const getBlockBytes = async (reader: BinaryReader, abHeader: any) => {
    // Skip unused header info
    // -----------------------
    // const minimumStreamedBytes = reader.readU32();
    // abHeader.size = reader.readU32(); // Always 60
    // const numberOfLevelToDownloadBeforeStreaming = reader.readU32();
    // const levelCount = reader.readU32(); // Always 1
    // const compressedSize = reader.readU32()
    reader.position += 20;

    const uncompressedSize = reader.readU32();

    // Skip unused header info
    // -----------------------
    // const flags = abHeader.signature === "UnityWeb" ? 1 : 0
    // const completeFileSize = reader.readU32();
    // const fileInfoHeaderSize = reader.readU32();

    // reader.position = abHeader.size;
    reader.position = 60;

    // Decompress block
    const uncompressedBytes = reader.readBytes(uncompressedSize);
    if (abHeader.signature === "UnityWeb") {
        const data = await LZMA.decompress(new Uint8Array(uncompressedBytes));
        return Uint8Array.from(data).buffer;
    } else {
        return uncompressedBytes;
    }
};

const getAssetFileBytes = (reader: BinaryReader, blockBytes: ArrayBuffer): ArrayBuffer => {
    // Asset file info
    // const nodesCount = reader.readI32(); // Always 1
    reader.position += 4;
    // const path = reader.readStringToNull();
    reader.readStringToNull();
    const offset = reader.readU32();
    // const size = reader.readU32()
    reader.position += 4;
    return blockBytes.slice(offset);
};

const getAssetFile = (reader: BinaryReader) => {
    // const metaDataSize = reader.readU32();
    // const fileSize = reader.readU32();
    // const version = reader.readU32();
    reader.position = 12;
    const dataOffset = reader.readU32();
    // const endianess = reader.readByte();
    // const reserved = reader.readBytes(3);
    reader.isLittleEndian = true;
    // const unityVersion = reader.readStringToNull(); // Always 5.0.1p2
    // const targetPlatform = reader.readI32(); // Always 5 (Windows)
    // const enableTypeTree = reader.readBoolean(); // Always true
    reader.position = 33;

    // Types
    const typeCount = reader.readI32();
    // const types = [];
    for (let i = 0; i < typeCount; i++) {
        // const type: any = {
        //     classId: null,
        //     isStrippedType: null,
        //     scriptTypeIndex: -1,
        //     nodes: null,
        //     scriptId: null,
        //     oldTypeHash: null,
        //     typeDependecies: null
        // };
        const classId = reader.readI32();
        if (classId < 0) {
            // type.scriptId = reader.readBytes(16); //hash128
            reader.position += 16;
        }
        // type.oldTypeHash = reader.readBytes(16); //hash128
        reader.position += 16;

        // const typeTree: any = [];
        const numberOfNodes = reader.readI32();
        const stringBufferSize = reader.readI32();
        // for (let j = 0; j < numberOfNodes; j++) {
        //     const typeTreeNode: any = {
        //         type: null,
        //         name: null,
        //         byteSize: null,
        //         index: null,
        //         isArray: null,
        //         version: null,
        //         metaFlag: null,
        //         level: null,
        //         typeStrOffset: null,
        //         nameStrOffset: null,
        //         refTypeHash: null
        //     };
        //     typeTreeNode.version = reader.readI16();
        //     typeTreeNode.level = reader.readByte();
        //     typeTreeNode.isArray = reader.readBoolean() ? 1 : 0;
        //     typeTreeNode.typeStrOffset = reader.readU32();
        //     typeTreeNode.nameStrOffset = reader.readU32();
        //     typeTreeNode.byteSize = reader.readI32();
        //     typeTreeNode.index = reader.readI32();
        //     typeTreeNode.metaFlag = reader.readI32();
        //     typeTree.push(typeTreeNode);
        // }
        // const stringBuffer = reader.readBytes(stringBufferSize);
        // const stringBufferReader = new BinaryReader(new DataView(stringBuffer));
        // for (let j = 0; j < numberOfNodes; j++) {
        //     typeTree[j].type = readString(stringBufferReader, typeTree[j].typeStrOffset);
        //     typeTree[j].name = readString(stringBufferReader, typeTree[j].nameStrOffset);
        // }
        // type.nodes = typeTree;
        reader.position += numberOfNodes * 24 + stringBufferSize;
        // types.push(type);
    }

    // Objects
    const objectCount = reader.readI32();
    const objectInfos = [];
    for (let i = 0; i < objectCount; i++) {
        const objectInfo: any = {
            byteStart: null,
            // byteSize: null,
            // typeId: null,
            classId: null,
            // pathId: null,
            // serializedType: null
        };

        reader.align();
        //objectInfo.pathId = reader.readI64();
        reader.position += 8;
        objectInfo.byteStart = reader.readU32();
        objectInfo.byteStart += dataOffset;
        //objectInfo.byteSize = reader.readU32();
        //objectInfo.typeId = reader.readI32();
        reader.position += 8;
        objectInfo.classId = reader.readU16();
        // objectInfo.serializedType = types.filter(x => x.classId === objectInfo.typeId);
        // const scriptTypeIndex = reader.readI16();
        // if (objectInfo.serializedType != null) {
        //     objectInfo.serializedType.scriptTypeIndex = scriptTypeIndex;
        // }
        // const stripped = reader.readByte();
        reader.position += 3;
        objectInfos.push(objectInfo);
    }

    // Scripts
    // const scriptCount = reader.readI32();
    // const scriptTypes = [];
    // for (let i = 0; i < scriptCount; i++) {
    //     const scriptType: any = {
    //         localSerializedFileIndex: null,
    //         localIdentifierInFile: null
    //     };
    //     scriptType.localSerializedFileIndex = reader.readI32();
    //     reader.align();
    //     scriptType.localIdentifierInFile = reader.readI64();
    //     scriptTypes.push(scriptType);
    // }

    // Externals
    // const externalsCount = reader.readI32();
    // const externals = [];
    // for (let i = 0; i < externalsCount; i++) {
    //     const external: any = {
    //         guid: null,
    //         type: null,
    //         pathName: null,
    //         fileName: null
    //     };
    //     // const tempEmpty = reader.readStringToNull();
    //     reader.readStringToNull();
    //     external.guid = reader.readBytes(16);
    //     external.type = reader.readI32();
    //     external.pathName = reader.readStringToNull();
    //     const fileName = external.pathName.split("/");
    //     external.fileName = fileName[fileName.length - 1];
    //     externals.push(external);
    // }
    // const userInformation = reader.readStringToNull();

    // objectInfos only needed value of which byteStart and classId are read
    return {
        // header: {
        //     metaDataSize: metaDataSize,
        //     fileSize: fileSize,
        //     version: version,
        //     dataOffset: dataOffset,
        //     endianess: endianess,
        //     reserved: reserved
        // },
        // version: [5, 0, 1, 2],
        // buildType: "p",
        // unityVersion: unityVersion,
        // targetPlatform: targetPlatform,
        // enableTypeTree: enableTypeTree,
        // types: types,
        objectInfos: objectInfos,
        // scriptTypes: scriptTypes,
        // externals: externals
    };
};

// const readString = (stringBufferReader: BinaryReader, value: number) => {
//     const isOffset = (value & 0x80000000) === 0;
//     if (isOffset) {
//         stringBufferReader.position = value;
//         return stringBufferReader.readStringToNull();
//     }
//     const offset = value & 0x7FFFFFFF;
//     if (commonString[offset] !== undefined) {
//         return commonString[offset];
//     }
//     return offset.toString();
// };

export { getResourceInfo, getGameData, extractResourceAsURL, extractResourceAsTextureInfo };
