import { getAssetBlobURL, getAssetInfo, getAssetObject } from "@extractor/assetExtraction";
import { AssetBundle } from "@extractor/assets/assetBundle";
import { GameObject } from "@extractor/assets/gameObject";
import { SkinnedMeshRenderer } from "@extractor/assets/skinnedMeshRenderer";
import { Transform } from "@extractor/assets/transform";
import { ClassID } from "@extractor/consts";
import { extractContainerDatas } from "@extractor/containerExtraction";

interface JobPrefab {
    id: string;
    meshes: Array<{
        name: string;
        mesh: string;
    }>;
    textures: {
        color: string;
        normal: string;
        material: string;
    };
}

// interface BoneNode {
//     name: string;
//     pathId: string;
//     localRotation: Quaternion;
//     localPosition: Vector3;
//     localScale: Vector3;
//     father: BoneNode;
//     children: Array<BoneNode>;
// }

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

        const mesh = getURLWithPathId(skinnedMeshRenderer.mesh.pathId, 0);

        meshes.push({
            name: name,
            mesh: mesh,
        });
    }

    // const rootTransform = getObjectWithPathId(prefabTransform.children[1].pathId, 0) as Transform;

    return {
        id: id,
        meshes: meshes,
        textures: textures,
    };
};

export { getJobPrefab };
