import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";

const getAssetBundle = (reader: BinaryReader) => {
    const assetBundleData = getAssetBundleData(reader);
    const file = JSON.stringify(assetBundleData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface AssetBundle {
    preloadTable: Array<Pointer>;
    container: Array<{
        name: string;
        preloadIndex: number;
        preloadSize: number;
        asset: Pointer;
    }>;
}

const getAssetBundleData = (reader: BinaryReader): AssetBundle => {
    const preloadTableSize = reader.readI32();
    const preloadTable = [];
    for (let i = 0; i < preloadTableSize; i++) {
        preloadTable.push(getPointer(reader));
    }

    const containerSize = reader.readI32();
    const container = [];
    for (let i = 0; i < containerSize; i++) {
        container.push({
            name: reader.readAlignedString(),
            preloadIndex: reader.readI32(),
            preloadSize: reader.readI32(),
            asset: getPointer(reader),
        });
    }

    return {
        preloadTable: preloadTable,
        container: container,
    };
};

export { getAssetBundle };
