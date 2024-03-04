import LZMA from "@lib/lzma";
import BinaryReader from "../pages/replica/extractor/extractor/binaryReader";
import { readFile } from "./fileSystemAccess";
import { ClassID } from "./consts";
import { AssetInfo } from "./assetExtraction";

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
    let reader: BinaryReader = new BinaryReader(new DataView(containerFile));
    // Container header
    const containerHeader = getContainerHeader(reader);
    if (containerHeader.signature !== "UnityRaw" && containerHeader.signature !== "UnityWeb") {
        throw new Error(`Signature: ${containerHeader.signature} is not supported.`);
    }
    // AssetFile bytes
    const blockBytes = await getBlockBytes(reader, containerHeader.signature);
    reader = new BinaryReader(new DataView(blockBytes));
    const { assetFileBytes, name } = getAssetFileBytes(reader, blockBytes);
    reader = new BinaryReader(new DataView(assetFileBytes));
    // AssetFile
    const assetFile = getAssetFile(reader);
    // AssetInfos
    const assetInfos = [];
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

interface ObjectInfoType {
    pathId: bigint;
    byteStart: number;
    byteSize: number;
    classId: number;
}

const getAssetFile = (reader: BinaryReader): Array<ObjectInfoType> => {
    reader.position = 12;
    const dataOffset = reader.readU32();
    reader.isLittleEndian = true;
    reader.position = 33;

    // Types
    const typeCount = reader.readI32();
    for (let i = 0; i < typeCount; i++) {
        const classId = reader.readI32();
        if (classId < 0) {
            reader.position += 16;
        }
        reader.position += 16;
        const numberOfNodes = reader.readI32();
        const stringBufferSize = reader.readI32();
        reader.position += numberOfNodes * 24 + stringBufferSize;
    }

    // Objects
    const objectCount = reader.readI32();
    const objectInfos = [];
    for (let i = 0; i < objectCount; i++) {
        reader.align();
        const pathId = reader.readI64();
        let byteStart = reader.readU32();
        byteStart += dataOffset;
        const byteSize = reader.readU32();
        reader.position += 4;
        const classId = reader.readU16();
        reader.position += 3;
        objectInfos.push({
            pathId: pathId,
            byteStart: byteStart,
            byteSize: byteSize,
            classId: classId,
        });
    }

    return objectInfos;
};

const getAssetName = (reader: BinaryReader, classId: number): string => {
    if (ClassID.GameObject === classId) {
        return "";
    }
    let assetName: string = "";
    const length = reader.readI32();
    if (length > 0 && length <= reader.dataView.byteLength - reader.position) {
        const stringData = reader.readBytes(length);
        const decoder = new TextDecoder();
        reader.align();
        assetName = decoder.decode(stringData);
    }
    return assetName;
};

export { extractContainerDatas, getAssetName };
