import BinaryReader from "@extractor/binaryReader";
import { getTexture2D } from "./assets/texture2D";
import { ClassID } from "./consts";
import { TypeInfo, extractContainerDatas, getAssetName } from "./containerExtraction";
import { getMesh } from "./assets/mesh";
import { getGameObject } from "./assets/gameObject";
import { getTransform } from "./assets/transform";
import { getAssetBundle } from "./assets/assetBundle";
import { getMonoBehaviour } from "./assets/monoBehaviour";
import { getMonoScript } from "./assets/monoScript";

interface AssetInfo {
    name: string;
    byteStart: number;
    byteSize: number;
    types: TypeInfo;
    classId: number;
    pathId: string;
}

const getAsset = async (containerPath: string, pathId: string): Promise<string> => {
    const container = await extractContainerDatas([containerPath]);
    const assetInfo = container[0].assetInfos.find((info) => info.pathId === pathId);
    if (!assetInfo) {
        throw new Error(`Did not find asset with pathId: ${pathId} in container: ${containerPath}`);
    }
    return getAssetBlobURL(assetInfo, container[0].assetBytes);
};

const getAssetBlobURL = (assetInfo: AssetInfo, assetBytes: ArrayBuffer): string => {
    const reader = new BinaryReader(assetBytes, assetInfo.byteStart, true);
    getAssetName(reader, assetInfo.classId);
    let blobUrl = "";
    switch (assetInfo.classId) {
        case ClassID.GameObject:
            blobUrl = getGameObject(reader);
            break;
        case ClassID.Transform:
            blobUrl = getTransform(reader);
            break;
        case ClassID.Texture2D:
            blobUrl = getTexture2D(reader);
            break;
        case ClassID.Mesh:
            blobUrl = getMesh(reader, assetInfo.name);
            break;
        case ClassID.MonoBehaviour:
            blobUrl = getMonoBehaviour(reader, assetInfo);
            break;
        case ClassID.MonoScript:
            blobUrl = getMonoScript(reader);
            break;
        case ClassID.AssetBundle:
            blobUrl = getAssetBundle(reader);
            break;
        default:
            break;
    }

    return blobUrl;
};

export { getAssetBlobURL, getAsset };
export type { AssetInfo };
