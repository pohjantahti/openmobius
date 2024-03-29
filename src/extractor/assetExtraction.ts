import BinaryReader from "@extractor/binaryReader";
import { getTexture2D } from "./assets/texture2D";
import { ClassID } from "./consts";
import { TypeInfo, extractContainerDatas, getAssetName } from "./containerExtraction";
import { getMesh } from "./assets/mesh";
import { getGameObject, getGameObjectData } from "./assets/gameObject";
import { getTransform, getTransformData } from "./assets/transform";
import { getAssetBundle, getAssetBundleData } from "./assets/assetBundle";
import { getMonoBehaviour, getMonoBehaviourData } from "./assets/monoBehaviour";
import { getMonoScript, getMonoScriptData } from "./assets/monoScript";
import { getSkinnedMeshRenderer, getSkinnedMeshRendererData } from "./assets/skinnedMeshRenderer";

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
    const assetInfo = getAssetInfo(container[0].assetInfos, pathId);
    return getAssetBlobURL(assetInfo, container[0].assetBytes);
};

const getAssetInfo = (assetInfos: Array<AssetInfo>, pathId: string) => {
    const assetInfo = assetInfos.find((info) => info.pathId === pathId);
    if (assetInfo) {
        return assetInfo;
    } else {
        throw new Error(`Could not find asset with pathId: ${pathId} in ${assetInfos}`);
    }
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
        case ClassID.SkinnedMeshRenderer:
            blobUrl = getSkinnedMeshRenderer(reader);
            break;
        case ClassID.AssetBundle:
            blobUrl = getAssetBundle(reader);
            break;
        default:
            break;
    }

    return blobUrl;
};

const getAssetObject = (assetInfo: AssetInfo, assetBytes: ArrayBuffer) => {
    const reader = new BinaryReader(assetBytes, assetInfo.byteStart, true);
    getAssetName(reader, assetInfo.classId);
    let assetObject;
    switch (assetInfo.classId) {
        case ClassID.GameObject:
            assetObject = getGameObjectData(reader);
            break;
        case ClassID.Transform:
            assetObject = getTransformData(reader);
            break;
        case ClassID.MonoBehaviour:
            assetObject = getMonoBehaviourData(reader, assetInfo);
            break;
        case ClassID.MonoScript:
            assetObject = getMonoScriptData(reader);
            break;
        case ClassID.SkinnedMeshRenderer:
            assetObject = getSkinnedMeshRendererData(reader);
            break;
        case ClassID.AssetBundle:
            assetObject = getAssetBundleData(reader);
            break;
        default:
            throw new Error(`Unsupported asset type: ${assetInfo}`);
            break;
    }

    return assetObject;
};

export { getAssetBlobURL, getAsset, getAssetObject, getAssetInfo };
export type { AssetInfo };
