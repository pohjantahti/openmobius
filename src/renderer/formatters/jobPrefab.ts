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
import { loadObj } from "@lib/obj2gltf";

interface JobPrefab {
    id: string;
    meshes: Array<{
        name: string;
        mesh: string;
        skin: Array<{
            weight: Array<number>;
            boneIndex: Array<number>;
        }>;
        vertices: Array<number>;
        UV0: Array<number>;
        normals: Array<number>;
        indices: Array<number>;
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
            vertices: meshData.vertices,
            UV0: meshData.UV0,
            normals: meshData.normals,
            indices: meshData.indices,
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

enum ComponentType {
    Byte = 5120,
    UByte = 5121,
    Short = 5122,
    UShort = 5123,
    UInt = 5125,
    Float = 5126,
}

enum AccessorType {
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4",
    SCALAR = "SCALAR",
    MAT4 = "MAT4",
}

enum BufferViewTarget {
    ArrayBuffer = 34962,
    ElementArrayBuffer = 34963,
}

// Partial glTF type with only the relevant properties (for this project)
// https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
interface GLTF {
    asset: {
        version: "2.0";
    };
    accessors: Array<{
        bufferView: number;
        byteOffset?: number;
        componentType: ComponentType;
        count: number;
        type: AccessorType;
        max?: Array<number>;
        min?: Array<number>;
        name?: string;
    }>;
    scene: number;
    scenes: Array<{
        nodes: Array<number>;
        name?: string;
    }>;
    nodes: Array<{
        skin?: number;
        mesh?: number;
        children?: Array<number>;
        translation?: Array<number>;
        rotation?: Array<number>;
        scale?: Array<number>;
        name?: string;
    }>;
    meshes: Array<{
        primitives: Array<{
            attributes: {
                POSITION: number;
                NORMAL: number;
                TEXCOORD_0: number;
                JOINTS_0?: number;
                WEIGHTS_0?: number;
            };
            indices: number;
            material: number;
            mode?: number;
        }>;
        name?: string;
    }>;
    materials: Array<{
        pbrMetallicRoughness: {
            baseColorTexture?: {
                index: number;
            };
            baseColorFactor?: Array<number>;
            metallicRoughnessTexture?: {
                index: number;
            };
            metallicFactor?: number;
            roughnessFactor?: number;
        };
        normalTexture?: {
            index: number;
        };
        alphaMode?: string;
        name?: string;
    }>;
    // skins: Array<{}>
    buffers: Array<{
        uri: string;
        byteLength: number;
        name?: string;
    }>;
    bufferViews: Array<{
        buffer: number;
        byteOffset: number;
        byteLength: number;
        byteStride?: number;
        target?: BufferViewTarget;
        name?: string;
    }>;
    textures: Array<{
        sampler: number;
        source: number;
        name?: string;
    }>;
    images: Array<{
        uri: string;
        name?: string;
    }>;
    samplers: Array<{
        wrapS: 10497;
        wrapT: 10497;
        name?: string;
    }>;
}

const getJobPrefabGltf = async (id: string) => {
    const jobPrefab = await getJobPrefab(id);

    const gltf: GLTF = {
        asset: {
            version: "2.0",
        },
        scene: 0,
        scenes: [
            {
                nodes: [],
            },
        ],
        nodes: [],
        meshes: [],
        materials: [
            {
                pbrMetallicRoughness: {
                    baseColorTexture: {
                        index: 0,
                    },
                    metallicFactor: 0,
                    roughnessFactor: 1,
                },
                normalTexture: {
                    index: 1,
                },
                alphaMode: "MASK",
            },
        ],
        textures: [
            {
                sampler: 0,
                source: 0,
            },
            {
                sampler: 0,
                source: 1,
            },
            {
                sampler: 0,
                source: 2,
            },
        ],
        images: [
            {
                uri: jobPrefab.textures.color,
            },
            {
                uri: jobPrefab.textures.normal,
            },
            {
                uri: jobPrefab.textures.material,
            },
        ],
        samplers: [
            {
                wrapS: 10497,
                wrapT: 10497,
            },
        ],

        accessors: [],
        buffers: [],
        bufferViews: [],
    };

    let i = 0;
    for (const children of jobPrefab.meshes) {
        const file = await loadObj(children.mesh);

        const positions = file[0].meshes[0].primitives[0].positions;
        const normals = file[0].meshes[0].primitives[0].normals;
        const uvs = file[0].meshes[0].primitives[0].uvs;
        const indices = file[0].meshes[0].primitives[0].indices;

        // const positions = children.vertices;
        // const normals = children.normals;
        // const uvs = children.UV0;
        // const indices = children.indices;

        const positionsAccessor = {
            bufferView: gltf.bufferViews.length,
            componentType: ComponentType.Float,
            count: positions.length / 3,
            type: AccessorType.VEC3,
            min: [-10, -10, -10],
            max: [10, 10, 10],
            name: `${i}_positions_accessor`,
        };
        const normalsAccessor = {
            bufferView: gltf.bufferViews.length + 1,
            componentType: ComponentType.Float,
            count: normals.length / 3,
            type: AccessorType.VEC3,
            name: `${i}_normals_accessor`,
        };
        const uvsAccessor = {
            bufferView: gltf.bufferViews.length + 2,
            componentType: ComponentType.Float,
            count: uvs.length / 2,
            type: AccessorType.VEC2,
            name: `${i}_uvs_accessor`,
        };
        const indicesAccessor = {
            bufferView: gltf.bufferViews.length + 3,
            componentType: ComponentType.UShort,
            count: indices.length,
            type: AccessorType.SCALAR,
            name: `${i}_indices_accessor`,
        };

        const positionsBufferView = {
            buffer: gltf.buffers.length,
            byteOffset: 0,
            byteLength: positions.length * 4,
            byteStride: 12,
            target: BufferViewTarget.ArrayBuffer,
            name: `${i}_positions_bufferView`,
        };
        const normalsBufferView = {
            buffer: gltf.buffers.length,
            byteOffset: positionsBufferView.byteOffset + positionsBufferView.byteLength,
            byteLength: normals.length * 4,
            byteStride: 12,
            target: BufferViewTarget.ArrayBuffer,
            name: `${i}_normals_bufferView`,
        };
        const uvsBufferView = {
            buffer: gltf.buffers.length,
            byteOffset: normalsBufferView.byteOffset + normalsBufferView.byteLength,
            byteLength: uvs.length * 4,
            byteStride: 8,
            target: BufferViewTarget.ArrayBuffer,
            name: `${i}_uvs_bufferView`,
        };
        const indicesBufferView = {
            buffer: gltf.buffers.length,
            byteOffset: uvsBufferView.byteOffset + uvsBufferView.byteLength,
            byteLength: indices.length * 2,
            target: BufferViewTarget.ElementArrayBuffer,
            name: `${i}_indices_bufferView`,
        };

        const buffer = new DataView(
            new ArrayBuffer(indicesBufferView.byteOffset + indicesBufferView.byteLength)
        );

        let offset = 0;
        for (const num of positions) {
            buffer.setFloat32(offset, num, true);
            offset += 4;
        }
        for (const num of normals) {
            buffer.setFloat32(offset, num, true);
            offset += 4;
        }
        for (const num of uvs) {
            buffer.setFloat32(offset, num, true);
            offset += 4;
        }
        for (const num of indices) {
            buffer.setUint16(offset, num, true);
            offset += 2;
        }

        gltf.buffers.push({
            byteLength: buffer.buffer.byteLength,
            // ArrayBuffer to base64
            // https://stackoverflow.com/a/42334410
            uri: `data:application/octet-stream;base64,${btoa(
                new Uint8Array(buffer.buffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            )}`,
        });

        gltf.scenes[0].nodes.push(gltf.nodes.length);
        gltf.nodes.push({ mesh: gltf.meshes.length });

        gltf.meshes.push({
            primitives: [
                {
                    attributes: {
                        POSITION: gltf.accessors.length,
                        NORMAL: gltf.accessors.length + 1,
                        TEXCOORD_0: gltf.accessors.length + 2,
                    },
                    indices: gltf.accessors.length + 3,
                    material: 0,
                },
            ],
            name: children.name,
        });

        gltf.accessors.push(positionsAccessor, normalsAccessor, uvsAccessor, indicesAccessor);
        gltf.bufferViews.push(
            positionsBufferView,
            normalsBufferView,
            uvsBufferView,
            indicesBufferView
        );
        i++;
    }

    const blob = new Blob([JSON.stringify(gltf)], { type: "model/gltf" });
    return window.URL.createObjectURL(blob);
};

export { getJobPrefab, getJobPrefabGltf };
export type { JobPrefab, BoneNode };
