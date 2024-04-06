import { getAssetBlobURL, getAssetInfo, getAssetObject } from "@extractor/assetExtraction";
import { AssetBundle } from "@extractor/assets/assetBundle";
import { GameObject } from "@extractor/assets/gameObject";
import { MeshData, createObjFile } from "@extractor/assets/mesh";
import { SkinnedMeshRenderer } from "@extractor/assets/skinnedMeshRenderer";
import { Transform } from "@extractor/assets/transform";
import { Quaternion, Vector3 } from "@extractor/assets/types";
import { createBlobURL } from "@extractor/assets/utils";
import { ClassID } from "@extractor/consts";
import { extractContainerDatas } from "@extractor/containerExtraction";

interface JobPrefab {
    id: string;
    meshes: Array<{
        name: string;
        mesh: string;
        skin: Array<{
            weight: Array<number>;
            boneIndex: Array<number>;
        }>;
    }>;
    textures: {
        color: string;
        normal: string;
        material: string;
    };
    rootBone: BoneNode;
}

interface BoneNode {
    name: string;
    pathId: string;
    localRotation: Quaternion;
    localPosition: Vector3;
    localScale: Vector3;
    children: Array<BoneNode>;
}

const getJobPrefab = async (id: string): Promise<JobPrefab> => {
    const file = await fetch("./assets/containers.json");
    const containers: Array<{ container: string; name: string }> = await file.json();
    const jobContainer = containers.find((container) => container.name === `CAB-${id}_win`);
    const textureContainer = containers.find(
        (container) => container.name === `CAB-${id}_textures_win`
    );

    if (!jobContainer) {
        throw new Error(`Could not find container: CAB-${id}_win`);
    }
    if (!textureContainer) {
        throw new Error(`Could not find container: CAB-${id}_textures_win`);
    }

    const containerData = await extractContainerDatas([
        jobContainer.container,
        textureContainer.container,
    ]);

    const getObjectWithPathId = (pathId: string, index: number) => {
        return getAssetObject(
            getAssetInfo(containerData[index].assetInfos, pathId),
            containerData[index].assetBytes
        );
    };

    const getURLWithPathId = (pathId: string, index: number) => {
        return getAssetBlobURL(
            getAssetInfo(containerData[index].assetInfos, pathId),
            containerData[index].assetBytes
        );
    };

    const prefabAssetInfo = getAssetInfo(containerData[0].assetInfos, "1");
    const prefabAB = getAssetObject(prefabAssetInfo, containerData[0].assetBytes) as AssetBundle;
    const prefabEntry = prefabAB.container.find((x) => x.name.includes(`${id}.prefab`))!;

    const textureAssetInfo = getAssetInfo(containerData[1].assetInfos, "1");
    const textureAB = getAssetObject(textureAssetInfo, containerData[1].assetBytes) as AssetBundle;
    const colorTexture = textureAB.container.find((x) => x.name.includes(`${id}_c01`))!;
    const normalTexture = textureAB.container.find((x) => x.name.includes(`${id}_n01`))!;
    const materialTexture = textureAB.container.find((x) => x.name.includes(`${id}_m01`))!;

    const textures = {
        color: getURLWithPathId(colorTexture.asset.pathId, 1),
        normal: getURLWithPathId(normalTexture.asset.pathId, 1),
        material: getURLWithPathId(materialTexture.asset.pathId, 1),
    };

    const prefabObject = getObjectWithPathId(prefabEntry.asset.pathId, 0) as GameObject;
    const prefabTransformInfo = prefabObject.components.find((x) => x.type === ClassID.Transform)!;
    const prefabTransform = getObjectWithPathId(
        prefabTransformInfo.component.pathId,
        0
    ) as Transform;

    const meshCollectionTransform = getObjectWithPathId(
        prefabTransform.children[0].pathId,
        0
    ) as Transform;

    const meshes = [];
    for (const children of meshCollectionTransform.children) {
        const transform = getObjectWithPathId(children.pathId, 0) as Transform;
        const gameObject = getObjectWithPathId(transform.gameObject.pathId, 0) as GameObject;
        const name = gameObject.name;
        const smrInfo = gameObject.components.find((x) => x.type === ClassID.SkinnedMeshRenderer)!;
        const skinnedMeshRenderer = getObjectWithPathId(
            smrInfo.component.pathId,
            0
        ) as SkinnedMeshRenderer;

        const meshData = getObjectWithPathId(skinnedMeshRenderer.mesh.pathId, 0) as MeshData;
        const mesh = createBlobURL(createObjFile(meshData), "model/obj");

        meshes.push({
            name: name,
            mesh: mesh,
            skin: meshData.skin,
        });
    }

    const getBoneNode = (transformPathId: string): BoneNode => {
        const transform = getObjectWithPathId(transformPathId, 0) as Transform;
        const gameObject = getObjectWithPathId(transform.gameObject.pathId, 0) as GameObject;
        const children: Array<BoneNode> = [];
        for (const child of transform.children) {
            children.push(getBoneNode(child.pathId));
        }

        return {
            name: gameObject.name,
            pathId: transformPathId,
            localRotation: transform.localRotation,
            localPosition: transform.localPosition,
            localScale: transform.localScale,
            children: children,
        };
    };

    const rootBone = getBoneNode(prefabTransform.children[1].pathId);

    return {
        id: id,
        meshes: meshes,
        textures: textures,
        rootBone: rootBone,
    };
};

export { getJobPrefab };
export type { JobPrefab, BoneNode };
