interface ResourceInfo {
    container: string;
    fileName: string;
    alias: string;
    width?: number;
    height?: number;
    xOffset?: number;
    yOffset?: number;
}

interface TextureInfo {
    imageBuffer: Uint8Array;
    width: number;
    height: number;
}

export type { ResourceInfo, TextureInfo };
