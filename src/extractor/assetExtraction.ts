import BinaryReader from "@extractor/binaryReader";
import { getTexture2D } from "./assets/texture2D";
import { ClassID } from "./consts";
import { extractContainerDatas, getAssetName } from "./containerExtraction";

interface AssetInfo {
    name: string;
    byteStart: number;
    byteSize: number;
    classId: number;
    pathId: bigint;
}

const getAsset = async (containerPath: string, pathId: string): Promise<string> => {
    const container = await extractContainerDatas([containerPath]);
    const assetInfo = container[0].assetInfos.find((info) => info.pathId === BigInt(pathId));
    if (!assetInfo) {
        throw new Error(`Did not find asset with pathId: ${pathId} in container: ${containerPath}`);
    }
    return getAssetBlobURL(assetInfo, container[0].assetBytes);
};

const getAssetBlobURL = (assetInfo: AssetInfo, assetBytes: ArrayBuffer): string => {
    const reader = new BinaryReader(new DataView(assetBytes), assetInfo.byteStart, true);
    getAssetName(reader, assetInfo.classId);

    let blobUrl = "";
    switch (assetInfo.classId) {
        case ClassID.Texture2D:
            blobUrl = getTexture2D(reader);
            break;
        case ClassID.Mesh:
            blobUrl = "Mesh";
            break;
        default:
            break;
    }

    return blobUrl;
};

export { getAssetBlobURL, getAsset };
export type { AssetInfo };
