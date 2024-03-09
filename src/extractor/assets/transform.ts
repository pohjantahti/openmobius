import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";
import { Quaternion, Vector3 } from "./types";

const getTransform = (reader: BinaryReader): string => {
    const transformData = getTransformData(reader);
    const file = JSON.stringify(transformData);

    const imageBlob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(imageBlob);
};

interface Transform {
    gameObject: Pointer;
    localRotation: Quaternion;
    localPosition: Vector3;
    localScale: Vector3;
    children: Array<Pointer>;
    father: Pointer;
}

const getTransformData = (reader: BinaryReader): Transform => {
    const gameObject = getPointer(reader);
    const localRotation = reader.readQuaternion();
    const localPosition = reader.readVector3();
    const localScale = reader.readVector3();
    const childrenSize = reader.readI32();
    const children: Array<Pointer> = [];
    for (let i = 0; i < childrenSize; i++) {
        children.push(getPointer(reader));
    }
    const father = getPointer(reader);

    return {
        gameObject: gameObject,
        localRotation: localRotation,
        localPosition: localPosition,
        localScale: localScale,
        children: children,
        father: father,
    };
};

export { getTransform };
