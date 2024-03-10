import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";

const getMonoBehaviour = (reader: BinaryReader) => {
    const monoBehaviourData = getMonoBehaviourData(reader);
    const file = JSON.stringify(monoBehaviourData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface MonoBehaviour {
    gameObject: Pointer;
    enabled: boolean;
    script: Pointer;
    name: string;
}

const getMonoBehaviourData = (reader: BinaryReader): MonoBehaviour => {
    const gameObject = getPointer(reader);
    const enabled = reader.readBoolean();
    reader.align();
    const script = getPointer(reader);
    const name = reader.readAlignedString();

    return {
        gameObject: gameObject,
        enabled: enabled,
        script: script,
        name: name,
    };
};

export { getMonoBehaviour };
