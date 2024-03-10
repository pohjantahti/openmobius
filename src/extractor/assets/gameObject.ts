import BinaryReader from "@extractor/binaryReader";
import { getPointer } from "./utils";

const getGameObject = (reader: BinaryReader): string => {
    const gameObjectData = getGameObjectData(reader);
    const file = JSON.stringify(gameObjectData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

const getGameObjectData = (reader: BinaryReader) => {
    const componentsSize = reader.readI32();
    const components = [];
    for (let i = 0; i < componentsSize; i++) {
        reader.readI32();
        components.push(getPointer(reader));
    }
    const layer = reader.readI32();
    const name = reader.readAlignedString();

    return {
        components: components,
        layer: layer,
        name: name,
    };
};

export { getGameObject };
