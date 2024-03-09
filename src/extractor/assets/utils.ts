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

export { getPointer };
export type { Pointer };
