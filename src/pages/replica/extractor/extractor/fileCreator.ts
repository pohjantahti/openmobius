import BinaryReader from "./binaryReader";
import decodeDXT from "@lib/decode-dxt";
import { ClassID, TextureFormat } from "./consts";
import { ResourceInfo, TextureInfo } from "./types";
import { AssetFile } from "./extractor";

const getResourceAsBlobURL = (
    reader: BinaryReader,
    assetFile: AssetFile,
    resourceInfo: ResourceInfo
): string => {
    for (const objectInfo of assetFile.objectInfos) {
        reader.position = objectInfo.byteStart;
        if (getFileName(reader) !== resourceInfo.fileName) {
            continue;
        }
        switch (objectInfo.classId) {
            case ClassID.Texture2D: {
                const { imageBuffer, width, height } = getTexture2D(reader, resourceInfo);
                return createBitmapImage(imageBuffer, resourceInfo, width, height);
            }
            case ClassID.TextAsset:
                return getTextAsset(reader);
            case ClassID.Font:
                return getFont(reader);
            default:
                // Some resources have same names but different types. No need to worry about them.
                // console.log("File type not supported", resourceInfo, objectInfo.classId);
                break;
        }
    }
    // Wrong information in "src\data\resources"
    throw new Error(
        `Resource: ${resourceInfo.alias} does not exist. ${JSON.stringify(resourceInfo)}`
    );
};

const getTextureInfo = (
    reader: BinaryReader,
    assetFile: AssetFile,
    resourceInfo: ResourceInfo
): TextureInfo => {
    for (const objectInfo of assetFile.objectInfos) {
        reader.position = objectInfo.byteStart;
        if (getFileName(reader) !== resourceInfo.fileName) {
            continue;
        }
        if (objectInfo.classId === ClassID.Texture2D) {
            return getTexture2D(reader, resourceInfo);
        }
    }
    // Wrong information in "src\data\resources"
    throw new Error(
        `Resource: ${resourceInfo.alias} does not exist. ${JSON.stringify(resourceInfo)}`
    );
};

const getFileName = (reader: BinaryReader): string => {
    let fileName: string = "";
    const length = reader.readI32();
    if (length > 0 && length <= reader.dataView.byteLength - reader.position) {
        const stringData = reader.readBytes(length);
        const decoder = new TextDecoder();
        reader.align();
        fileName = decoder.decode(stringData);
    }
    return fileName;
};

const getTextAsset = (reader: BinaryReader): string => {
    reader.position += 4;
    reader.position += 320; // Skip AKB2 header
    const length = reader.dataView.byteLength - reader.position;
    const fileData = reader.readBytes(length);

    const blob = new Blob([fileData], { type: "audio/ogg" });
    return window.URL.createObjectURL(blob);
};

const getTexture2D = (reader: BinaryReader, resourceInfo: ResourceInfo): TextureInfo => {
    const width = reader.readI32();
    const height = reader.readI32();
    // const completeImageSize = reader.readI32();
    reader.readI32();
    const textureFormat = reader.readI32();

    // Skip unused header info
    // -----------------------
    // const mipMap = reader.readBoolean();
    // const isReadable = reader.readBoolean();
    // const readAllowed = reader.readBoolean();
    // reader.align();
    // const imageCount = reader.readI32();
    // const textureDimension = reader.readI32();
    // const glTextureSettings = {
    //     version: [5, 0, 1, 2],
    //     filterMode: reader.readI32(),
    //     aniso: reader.readI32(),
    //     mipBias: reader.readFloat(),
    //     wrapMode: reader.readI32()
    // }
    // const lightmapFormat = reader.readI32();
    // const colorSpace = reader.readI32();
    reader.position += 36;

    const imageDataSize = reader.readI32();
    const imageData = reader.readBytes(imageDataSize);

    let imageBuffer: Uint8Array;
    switch (textureFormat) {
        case TextureFormat.DXT1:
            imageBuffer = decodeDXT(new DataView(imageData), width, height, "dxt1");
            break;
        case TextureFormat.DXT5:
            imageBuffer = decodeDXT(new DataView(imageData), width, height, "dxt5");
            break;
        default:
            console.error("Unknown texture format: " + textureFormat, resourceInfo);
            break;
    }

    return {
        imageBuffer: imageBuffer!,
        width: width,
        height: height,
    };
};

const createBitmapImage = (
    imageBuffer: Uint8Array,
    resourceInfo: ResourceInfo,
    width: number,
    height: number
): string => {
    // bitmap image conversion
    // https://stackoverflow.com/a/61246415

    const headerSize = 70;

    const imageSize = (resourceInfo.width || width) * (resourceInfo.height || height) * 4;

    const arr = new Uint8Array(headerSize + imageSize);
    const view = new DataView(arr.buffer);

    // File Header
    // BM magic number.
    view.setUint16(0, 0x424d, false);
    // File size.
    view.setUint32(2, arr.length, true);
    // Offset to image data.
    view.setUint32(10, headerSize, true);
    // BITMAPINFOHEADER
    // Size of BITMAPINFOHEADER
    view.setUint32(14, 40, true);
    // Width
    view.setInt32(18, resourceInfo.width || width, true);
    // Height (signed because negative values flip
    // the image vertically).
    view.setInt32(22, resourceInfo.height || height, true);
    // Number of colour planes (colours stored as
    // separate images; must be 1).
    view.setUint16(26, 1, true);
    // Bits per pixel.
    view.setUint16(28, 32, true);
    // Compression method, 6 = BI_ALPHABITFIELDS
    view.setUint32(30, 6, true);
    // Image size in bytes.
    view.setUint32(34, imageSize, true);
    // Horizontal resolution, pixels per metre.
    // This will be unused in this situation.
    view.setInt32(38, 10000, true);
    // Vertical resolution, pixels per metre.
    view.setInt32(42, 10000, true);
    // Number of colours. 0 = all
    view.setUint32(46, 0, true);
    // Number of important colours. 0 = all
    view.setUint32(50, 0, true);
    // Colour table. Because we used BI_ALPHABITFIELDS
    // this specifies the R, G, B and A bitmasks.
    // Red
    view.setUint32(54, 0x000000ff, true);
    // Green
    view.setUint32(58, 0x0000ff00, true);
    // Blue
    view.setUint32(62, 0x00ff0000, true);
    // Alpha
    view.setUint32(66, 0xff000000, true);

    // TODO: Do something about this
    if (!resourceInfo.width && !resourceInfo.height) {
        arr.set(imageBuffer, headerSize);
    } else {
        const x = resourceInfo.xOffset || 0;
        let y = resourceInfo.yOffset ? height - resourceInfo.yOffset - resourceInfo.height! : 0;
        if (y !== 0) {
            y++;
        }

        let startSkip = (y * width + x) * 4;
        // let startSkip = y !== 0 ? (y * width + x) * 4 : 0;
        const rowSkip = resourceInfo.width ? (width - resourceInfo.width) * 4 : 0;

        let k = 0;
        for (let i = 0; i < (resourceInfo.height || height); i++) {
            for (let j = 0; j < (resourceInfo.width || width); j++) {
                arr[headerSize + k] = imageBuffer[startSkip];
                arr[headerSize + k + 1] = imageBuffer[startSkip + 1];
                arr[headerSize + k + 2] = imageBuffer[startSkip + 2];
                arr[headerSize + k + 3] = imageBuffer[startSkip + 3];
                startSkip += 4;
                k += 4;
            }
            startSkip += rowSkip;
        }
    }

    const imageBlob = new Blob([arr], { type: "image/bmp" });
    return window.URL.createObjectURL(imageBlob);
};

const getFont = (reader: BinaryReader): string => {
    // Skip unused header info
    // -----------------------
    // const asciiStartOffset = reader.readI32();
    // const kerning = reader.readFloat();
    // const lineSpacing = reader.readFloat();
    // const characterSpacing = reader.readI32();
    // const characterPadding = reader.readI32();
    // const convertCase = reader.readI32();
    // const materialFileId = reader.readI32();
    // const materialPathId = reader.readI64();
    // const characterRectsSize = reader.readI32();
    // const textureFileId = reader.readI32();
    // const texturePathId = reader.readI64();
    // const kerningValuesSize = reader.readI32();
    // const pixelscale = reader.readFloat()
    reader.position += 60;

    const fontaDataSize = reader.readI32();
    const fontData = reader.readBytes(fontaDataSize);

    const imageBlob = new Blob([fontData], { type: "font/otf" });
    return window.URL.createObjectURL(imageBlob);
};

export { getResourceAsBlobURL, getTextureInfo, createBitmapImage };
