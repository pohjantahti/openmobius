import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";

const getGameObject = (reader: BinaryReader): string => {
    const gameObjectData = getGameObjectData(reader);
    const file = JSON.stringify(gameObjectData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface GameObject {
    components: Array<{
        type: number;
        component: Pointer;
    }>;
    layer: number;
    name: string;
}

const getGameObjectData = (reader: BinaryReader): GameObject => {
    const componentsSize = reader.readI32();
    const components = [];
    for (let i = 0; i < componentsSize; i++) {
        components.push({
            type: reader.readI32(),
            component: getPointer(reader),
        });
    }
    const layer = reader.readI32();
    const name = reader.readAlignedString();

    return {
        components: components,
        layer: layer,
        name: name,
    };
};

export { getGameObject, getGameObjectData };
export type { GameObject };
