import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";

const getSkinnedMeshRenderer = (reader: BinaryReader) => {
    const skinnedMeshRendererData = getSkinnedMeshRendererData(reader);
    const file = JSON.stringify(skinnedMeshRendererData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface SkinnedMeshRenderer {
    gameObject: Pointer;
    mesh: Pointer;
    bones: Array<Pointer>;
}

const getSkinnedMeshRendererData = (reader: BinaryReader): SkinnedMeshRenderer => {
    const gameObject = getPointer(reader);
    reader.readBoolean(); // enabled
    reader.align();
    reader.readBoolean(); // castShadows
    reader.readBoolean(); // castShadows
    reader.align();
    reader.readU16(); // lightMapIndex
    reader.readU16(); // lightMapIndexDynamic
    reader.readQuaternion(); // lightMapTilingOffset
    reader.readQuaternion(); // lightMapTilingOffsetDynamic

    const materialsSize = reader.readI32();
    const materials = [];
    for (let i = 0; i < materialsSize; i++) {
        materials.push(getPointer(reader));
    }

    reader.readU32Array(); // subsetIndices
    getPointer(reader); // staticBatchRoot
    reader.readBoolean(); // useLightProbes
    reader.align();
    reader.readI32(); // reflectionProbeUsage
    getPointer(reader); // lightProbeAnchor
    reader.readU32(); // sortingLayerID
    reader.readI16(); // sortingOrder
    reader.align();
    reader.readI32(); // quality
    reader.readBoolean(); // updateWhenOffscreen
    reader.align();

    const mesh = getPointer(reader);

    const bonesSize = reader.readI32();
    const bones = [];
    for (let i = 0; i < bonesSize; i++) {
        bones.push(getPointer(reader));
    }

    reader.readFloatArray(); // blendShapeWeights

    return {
        gameObject: gameObject,
        mesh: mesh,
        bones: bones,
    };
};

export { getSkinnedMeshRenderer, getSkinnedMeshRendererData };
export type { SkinnedMeshRenderer };
