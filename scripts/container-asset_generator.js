import LZMA from "../src/lib/lzma/src/lzma-d.js";
import { readFile, readdir, writeFile } from "fs/promises";

const supportedTypes = [28, 43];
const ignoredAssetNames = [
    "DefaultRadiationTexture",
    "DefaultOcclusionTexture",
    "DefaultNormalTexture",
    "DefaultBaseColorTexture",
    "DefaultMaterialTexture",
    "DefaultEffectTexture",
    "EnvironmentLight(Radiance)",
    "ColorCorrection(ColorMatrix)",
];

const init = async () => {
    // Full path to "/MOBIUS FINAL FANTASY/mobiusff_Data/mobius_data/Hash"
    const mffDataFolder = "";

    const containerFiles = [];
    for (const hashFolder of await readdir(mffDataFolder)) {
        for (const hashFile of await readdir(mffDataFolder + hashFolder))
            containerFiles.push(hashFolder + "/" + hashFile);
    }

    const containerAssetData = [];

    for (let i = 0; i < 100; i++) {
        const containerFilePath = containerFiles[i];
        const containerFile = await readFile(mffDataFolder + containerFilePath);
        let reader = new BinaryReader(containerFile.buffer);

        const containerHeader = getContainerHeader(reader);
        if (containerHeader.signature !== "UnityRaw" && containerHeader.signature !== "UnityWeb") {
            throw new Error(`Signature: ${containerHeader.signature} is not supported.`);
        }
        const blockBytes = await getBlockBytes(reader, containerHeader.signature);
        reader = new BinaryReader(blockBytes);

        const { assetFileBytes, name } = getAssetFileBytes(reader, blockBytes);
        reader = new BinaryReader(assetFileBytes);
        const assetFile = getAssetFile(reader);
        if (assetFile.length === 0) {
            continue;
        }

        const objectInfos = [];
        assetLoop: for (const asset of assetFile) {
            reader.position = asset.byteStart;
            const assetName = getAssetName(reader, asset.classId);

            for (const ignore of ignoredAssetNames) {
                if (assetName.includes(ignore)) {
                    continue assetLoop;
                }
            }
            if (assetName.length > 0) {
                objectInfos.push({
                    name: assetName,
                    classId: asset.classId,
                    pathId: asset.pathId,
                });
            } else {
                objectInfos.push({
                    classId: asset.classId,
                    pathId: asset.pathId,
                });
            }
        }
        containerAssetData.push({
            container: containerFilePath,
            name: name,
            assets: objectInfos,
        });
        if (i % 100 === 0) {
            console.log(`${i} / ${containerFiles.length}`);
        }
    }
    await writeFile(
        "./public/asset-viewer/containerAssets.json",
        JSON.stringify(containerAssetData, (_, v) => (typeof v === "bigint" ? v.toString() : v))
    );
};

const getContainerHeader = (reader) => {
    return {
        signature: reader.readStringToNull(),
        version: reader.readU32(),
        unityVersion: reader.readStringToNull(),
        unityRevision: reader.readStringToNull(),
    };
};

const getBlockBytes = async (reader, signature) => {
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

const getAssetFileBytes = (reader, blockBytes) => {
    reader.position += 4;
    const name = reader.readStringToNull();
    const offset = reader.readU32();
    reader.position += 4;
    return {
        assetFileBytes: blockBytes.slice(offset),
        name: name,
    };
};

const getAssetFile = (reader) => {
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
        if (supportedTypes.includes(classId)) {
            objectInfos.push({
                pathId: pathId,
                byteStart: byteStart,
                byteSize: byteSize,
                classId: classId,
            });
            continue;
        }
    }

    return objectInfos;
};

const getAssetName = (reader, classId) => {
    if (1 === classId) {
        return "";
    }
    let assetName = "";
    const length = reader.readI32();
    if (length > 0 && length <= reader.dataView.byteLength - reader.position) {
        const stringData = reader.readBytes(length);
        const decoder = new TextDecoder();
        reader.align();
        assetName = decoder.decode(stringData);
    }
    return assetName;
};

init();

// BINARYREADER

//-----------------------------------------------------------------------

/**
 * @param {ArrayBuffer} dataView
 * @param {position} position
 * @param {boolean} isLittleEndian
 */

class BinaryReader {
    constructor(arrayBuffer, position = 0, endian = false) {
        this.dataView = new DataView(arrayBuffer);
        this.position = position;
        this.isLittleEndian = endian;
    }

    /**
     * @param {number} align
     * @returns {void}
     */
    align(align = 4) {
        const remainder = this.position % align;
        if (remainder !== 0) {
            this.position += align - remainder;
        }
    }

    /**
     * @returns {ArrayBuffer}
     */
    readByte() {
        const value = this.dataView.buffer.slice(this.position, this.position + 1);
        this.position++;
        return value;
    }

    /**
     * @param {number} length
     * @returns {ArrayBuffer}
     */
    readBytes(length) {
        const value = this.dataView.buffer.slice(this.position, this.position + length);
        this.position += length;
        return value;
    }

    /**
     * @returns {number}
     */
    readI8() {
        const value = this.dataView.getInt8(this.position);
        this.position++;
        return value;
    }

    /**
     * @returns {number}
     */
    readU8() {
        const value = this.dataView.getUint8(this.position);
        this.position++;
        return value;
    }

    /**
     * @returns {number}
     */
    readI16() {
        const value = this.dataView.getInt16(this.position, this.isLittleEndian);
        this.position += 2;
        return value;
    }

    /**
     * @returns {number}
     */
    readU16() {
        const value = this.dataView.getUint16(this.position, this.isLittleEndian);
        this.position += 2;
        return value;
    }

    /**
     * @returns {number}
     */
    readI32() {
        const value = this.dataView.getInt32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    /**
     * @returns {number}
     */
    readU32() {
        const value = this.dataView.getUint32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    /**
     * @returns {BigInt}
     */
    readI64() {
        const value = this.dataView.getBigInt64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    /**
     * @returns {BigInt}
     */
    readU64() {
        const value = this.dataView.getBigUint64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    /**
     * @returns {string}
     */
    readStringToNull() {
        const bytes = [];
        while (this.position <= this.dataView.byteLength) {
            const byte = this.dataView.getInt8(this.position);
            this.position++;
            if (byte === 0) {
                break;
            } else {
                bytes.push(byte);
            }
        }
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(bytes).buffer);
    }

    /**
     * @returns {number}
     */
    readFloat() {
        const value = this.dataView.getFloat32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    /**
     * @returns {boolean}
     */
    readBoolean() {
        const value = this.dataView.getInt8(this.position) !== 0;
        this.position++;
        return value;
    }
}
