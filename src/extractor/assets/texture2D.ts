import BinaryReader from "../../pages/replica/extractor/extractor/binaryReader";
import { TextureFormat } from "@extractor/consts";
import decodeDXT from "@lib/decode-dxt";

const getTexture2D = (reader: BinaryReader): string => {
    const width = reader.readI32();
    const height = reader.readI32();
    reader.position += 4;
    const textureFormat = reader.readI32();
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
            throw new Error("Unkown texture format: " + textureFormat);
            break;
    }

    return createBitmapImage(imageBuffer, width, height);
};

const createBitmapImage = (imageBuffer: Uint8Array, width: number, height: number) => {
    // bitmap image conversion
    // https://stackoverflow.com/a/61246415

    const headerSize = 70;
    const imageSize = width * height * 4;
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
    view.setInt32(18, width, true);
    // Height (signed because negative values flip
    // the image vertically).
    view.setInt32(22, height, true);
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

    arr.set(imageBuffer, headerSize);

    const imageBlob = new Blob([arr], { type: "image/bmp" });
    return window.URL.createObjectURL(imageBlob);
};

export { getTexture2D };
