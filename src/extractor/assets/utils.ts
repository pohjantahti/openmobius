import BinaryReader from "@extractor/binaryReader";

interface Pointer {
    fileId: number;
    pathId: string;
}

const getPointer = (reader: BinaryReader): Pointer => {
    return {
        fileId: reader.readI32(),
        pathId: reader.readI64().toString(),
    };
};

const createBlobURL = (file: BlobPart, type: string): string => {
    const blob = new Blob([file], { type: type });
    return window.URL.createObjectURL(blob);
};

export { getPointer, createBlobURL };
export type { Pointer };
