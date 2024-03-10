import BinaryReader from "@extractor/binaryReader";
import { Vector3 } from "./types";

const getMesh = (reader: BinaryReader, name: string): string => {
    const meshData = getMeshData(reader, name);
    const file = createObjFile(name, meshData);

    const blob = new Blob([file], { type: "model/obj" });
    return window.URL.createObjectURL(blob);
};

const getMeshData = (reader: BinaryReader, name: string) => {
    let UV0: Array<number> = [];
    let normals: Array<number> = [];
    const indices: Array<number> = [];
    let vertices: Array<number> = [];

    const subMeshes = getSubMeshes(reader);
    getBlendShapeData(reader); // shaper
    reader.readMatrixArray(); // bindPose
    reader.readU32Array(); // boneNameHashes
    reader.readU32(); // rootBoneNameHash
    const meshCompression = reader.readByte();
    reader.readBoolean(); // isReadable
    reader.readBoolean(); // keepVertices
    reader.readBoolean(); // keepIndices
    reader.align();

    const indexBufferSize = reader.readI32();
    const indexBuffer = [];
    for (let i = 0; i < indexBufferSize / 2; i++) {
        indexBuffer.push(reader.readU16());
    }
    reader.align();

    const skinSize = reader.readI32();
    const skin = [];
    for (let i = 0; i < skinSize; i++) {
        skin.push({
            weight: reader.readFloatArray(4),
            boneIndex: reader.readI32Array(4),
        });
    }

    const vertexData = getVertexData(reader);
    const compressedMesh = getCompressedMesh(reader);

    reader.position += 24;

    reader.readI32(); // meshsUsageFlags
    reader.readU8Array(); // bakedConvexCollisionMesh
    reader.align();
    reader.readU8Array(); // bakedTriangleCollisionMesh
    reader.align();

    // processData()

    // readVexterData()
    const vertexCount = vertexData.vertexCount;
    for (let chn = 0; chn < vertexData.channels.length; chn++) {
        const channel = vertexData.channels[chn];
        if (channel.dimension > 0) {
            const stream = vertexData.streams[channel.stream];
            const channelMask = stream.channelMask;
            if (Number(channelMask.toString(2).split("").reverse().join("")[chn])) {
                if (chn === 2 && channel.format === 2) {
                    channel.dimension = 4;
                }
                const vertexFormat = getVertexFormat(channel.format);
                const componentByteSize = getFormatSize(vertexFormat);
                const componentBytes = new Array(
                    vertexCount * channel.dimension * componentByteSize
                ).fill(0);

                for (let v = 0; v < vertexCount; v++) {
                    const vertexOffset = stream.offset + channel.offset + stream.stride * v;
                    for (let d = 0; d < channel.dimension; d++) {
                        const componentOffset = vertexOffset + componentByteSize * d;
                        const destinationOffset = componentByteSize * (v * channel.dimension + d);

                        const copySize = componentByteSize;
                        for (let i = 0; i < copySize; i++) {
                            componentBytes[destinationOffset + i] =
                                vertexData.dataSize[componentOffset + i];
                        }
                    }
                }

                let componentsFloatArray = null;
                const size = componentByteSize;
                const len = componentBytes.length / size;
                const result = [];
                for (let i = 0; i < len; i++) {
                    switch (vertexFormat) {
                        case 0: {
                            const bytes = [
                                componentBytes[i * 4 + 3],
                                componentBytes[i * 4 + 2],
                                componentBytes[i * 4 + 1],
                                componentBytes[i * 4],
                            ];
                            const tempReader = new BinaryReader(new Uint8Array(bytes).buffer);
                            result[i] = tempReader.readFloat();
                            break;
                        }
                        case 1: {
                            const bytes = [componentBytes[i * 2 + 1], componentBytes[i * 2]];
                            const tempReader = new BinaryReader(new Uint8Array(bytes).buffer);
                            result[i] = int16ToFloat16(tempReader.readI16());
                            break;
                        }
                        case 2:
                            result[i] = componentBytes[i] / 255;
                            break;
                        case 6:
                        case 10:
                        default:
                            throw new Error(`Unsupported VertexFormat: ${vertexFormat}`);
                            break;
                    }
                }
                componentsFloatArray = result;

                switch (chn) {
                    case 0:
                        vertices = componentsFloatArray;
                        break;
                    case 1:
                        normals = componentsFloatArray;
                        break;
                    case 3:
                        UV0 = componentsFloatArray;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // decompressCompressedMesh()

    if (meshCompression) {
        throw new Error(`Mesh compression not supported: ${name}`);
    }

    for (const [key, value] of Object.entries(compressedMesh) as Array<
        [string, PackedFloatVector | PackedIntVector]
    >) {
        if (value.numItems !== 0 && key !== "UVInfo") {
            throw new Error(
                `CompressedMesh numItems not zero: ${key}, numItems: ${value.numItems}`
            );
        }
    }

    // getTriangles()

    for (const subMesh of subMeshes) {
        const firstIndex = subMesh.firstByte / 2;
        const indexCount = subMesh.indexCount;
        const topology = subMesh.topology;

        switch (topology) {
            case 0: {
                for (let i = 0; i < indexCount; i += 3) {
                    indices.push(indexBuffer[firstIndex + i]);
                    indices.push(indexBuffer[firstIndex + i + 1]);
                    indices.push(indexBuffer[firstIndex + i + 2]);
                }
                break;
            }
            case 1: {
                let triIndex = 0;
                for (let i = 0; i < indexCount - 2; i++) {
                    const a = indexBuffer[firstIndex + i];
                    const b = indexBuffer[firstIndex + i + 1];
                    const c = indexBuffer[firstIndex + i + 2];

                    if (a === b || a === c || b === c) continue;

                    if ((i & 1) === 1) {
                        indices.push(b);
                        indices.push(a);
                    } else {
                        indices.push(a);
                        indices.push(b);
                    }
                    indices.push(c);
                    triIndex += 3;
                }
                subMesh.indexCount = triIndex;
                break;
            }
            case 2: {
                for (let q = 0; q < indexCount; q += 4) {
                    indices.push(indexBuffer[firstIndex + q]);
                    indices.push(indexBuffer[firstIndex + q + 1]);
                    indices.push(indexBuffer[firstIndex + q + 2]);
                    indices.push(indexBuffer[firstIndex + q]);
                    indices.push(indexBuffer[firstIndex + q + 2]);
                    indices.push(indexBuffer[firstIndex + q + 3]);
                }
                subMesh.indexCount = (indexCount / 2) * 3;
                break;
            }
            default:
                throw new Error(`Unsupported topology: ${topology}`);
                break;
        }
    }

    return {
        vertexCount: vertexCount,
        vertices: vertices,
        UV0: UV0,
        normals: normals,
        subMeshes: subMeshes,
        indices: indices,
    };
};

interface SubMesh {
    firstByte: number;
    indexCount: number;
    topology: number;
    firstVertex: number;
    vertexCount: number;
    localAABB: {
        center: Vector3;
        extent: Vector3;
    };
}

const getSubMeshes = (reader: BinaryReader): Array<SubMesh> => {
    const subMeshesSize = reader.readI32();
    const subMeshes = [];
    for (let i = 0; i < subMeshesSize; i++) {
        subMeshes.push({
            firstByte: reader.readU32(),
            indexCount: reader.readU32(),
            topology: reader.readI32(),
            firstVertex: reader.readU32(),
            vertexCount: reader.readU32(),
            localAABB: {
                center: reader.readVector3(),
                extent: reader.readVector3(),
            },
        });
    }
    return subMeshes;
};

const getBlendShapeData = (reader: BinaryReader) => {
    const numVerts = reader.readI32();
    const vertices = [];
    for (let i = 0; i < numVerts; i++) {
        vertices.push({
            vertex: reader.readVector3(),
            normal: reader.readVector3(),
            tangent: reader.readVector3(),
            index: reader.readU32(),
        });
    }

    const numShapes = reader.readI32();
    const shapes = [];
    for (let i = 0; i < numShapes; i++) {
        shapes.push({
            firstVertex: reader.readU32(),
            vertexCount: reader.readU32(),
            hasNormals: reader.readBoolean(),
            hasTangents: reader.readBoolean(),
        });
        reader.align();
    }

    const numChannels = reader.readI32();
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push({
            name: reader.readAlignedString(),
            nameHash: reader.readU32(),
            frameIndex: reader.readI32(),
            frameCount: reader.readI32(),
        });
    }

    const fullWeights = reader.readFloatArray();

    return {
        vertices: vertices,
        shapers: shapes,
        channels: channels,
        fullWeights: fullWeights,
    };
};

const getVertexData = (reader: BinaryReader) => {
    const currentChannels = reader.readU32();
    const vertexCount = reader.readU32();
    const channelsSize = reader.readI32();
    const channels = [];
    for (let i = 0; i < channelsSize; i++) {
        channels.push({
            stream: reader.readByte(),
            offset: reader.readByte(),
            format: reader.readByte(),
            dimension: reader.readByte() & 0xf,
        });
    }

    const streamCount = channels.reduce((a, b) => Math.max(a, Number(b.stream)), 0) + 1;
    const streams = [];
    let offset = 0;
    for (let s = 0; s < streamCount; s++) {
        let chnMask = 0;
        let stride = 0;
        for (let chn = 0; chn < channels.length; chn++) {
            const channel = channels[chn];
            if (channel.stream === s) {
                if (channel.dimension > 0) {
                    chnMask |= 1 << chn;

                    const vertexFormat = getVertexFormat(channel.format);
                    const formatSize = getFormatSize(vertexFormat);

                    stride += channel.dimension * formatSize;
                }
            }
        }
        streams[s] = {
            channelMask: chnMask,
            offset: offset,
            stride: stride,
            dividerOp: 0,
            frequency: 0,
        };
        offset += vertexCount * stride;
        offset = (offset + (16 - 1)) & ~(16 - 1);
    }

    const dataSize = reader.readU8Array();
    reader.align();
    return {
        currentChannels: currentChannels,
        vertexCount: vertexCount,
        channels: channels,
        streams: streams,
        dataSize: dataSize,
    };
};

type VertexFormat = 0 | 1 | 2 | 6 | 10;

const getVertexFormat = (format: number): VertexFormat => {
    switch (format) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 6;
        case 4:
            return 10;
        default:
            throw new Error(`Unkown VertexFormat: ${format}`);
    }
};

type FormatSize = 4 | 2 | 1;

const getFormatSize = (vertexFormat: number): FormatSize => {
    switch (vertexFormat) {
        case 0:
        case 10:
            return 4;
        case 1:
            return 2;
        case 2:
        case 6:
            return 1;
        default:
            throw new Error(`Unkown VertexFormat: ${vertexFormat}`);
    }
};

const getCompressedMesh = (reader: BinaryReader) => {
    return {
        vertices: getPackedFloatVector(reader),
        UV: getPackedFloatVector(reader),
        normals: getPackedFloatVector(reader),
        tangents: getPackedFloatVector(reader),
        weights: getPackedIntVector(reader),
        normalSigns: getPackedIntVector(reader),
        tangentSigns: getPackedIntVector(reader),
        floatColors: getPackedFloatVector(reader),
        boneIndices: getPackedIntVector(reader),
        triangles: getPackedIntVector(reader),
        UVInfo: reader.readU32(),
    };
};

// https://stackoverflow.com/a/8796597
const int16ToFloat16 = (binary: number) => {
    const exponent = (binary & 0x7c00) >> 10,
        fraction = binary & 0x03ff;
    return (
        (binary >> 15 ? -1 : 1) *
        (exponent
            ? exponent === 0x1f
                ? fraction
                    ? NaN
                    : Infinity
                : Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
            : 6.103515625e-5 * (fraction / 0x400))
    );
};

interface PackedFloatVector {
    numItems: number;
    range: number;
    start: number;
    data: ArrayBuffer;
    bitSize: number;
}

const getPackedFloatVector = (reader: BinaryReader): PackedFloatVector => {
    const numItems = reader.readU32();
    const range = reader.readFloat();
    const start = reader.readFloat();
    const numData = reader.readI32();
    const data = reader.readBytes(numData);
    reader.align();
    const bitSize = reader.readByte();
    reader.align();

    return {
        numItems: numItems,
        range: range,
        start: start,
        data: data,
        bitSize: bitSize,
    };
};

interface PackedIntVector {
    numItems: number;
    data: ArrayBuffer;
    bitSize: number;
}

const getPackedIntVector = (reader: BinaryReader) => {
    const numItems = reader.readU32();
    const numData = reader.readI32();
    const data = reader.readBytes(numData);
    reader.align();
    const bitSize = reader.readByte();
    reader.align();

    return {
        numItems: numItems,
        data: data,
        bitSize: bitSize,
    };
};

const createObjFile = (
    fileName: string,
    meshData: {
        vertexCount: number;
        vertices: Array<number>;
        UV0: Array<number>;
        normals: Array<number>;
        subMeshes: Array<SubMesh>;
        indices: Array<number>;
    }
) => {
    const { vertexCount, vertices, UV0, normals, subMeshes, indices } = meshData;

    if (vertexCount <= 0) {
        throw new Error(`No vertices: ${fileName}`);
    }

    let file = "";
    file += `g ${fileName}\r\n`;

    //Vertices
    let c = 3;
    if (vertices.length === vertexCount * 4) {
        c = 4;
    }
    for (let v = 0; v < vertexCount; v++) {
        file += `v ${-vertices[v * c]} ${vertices[v * c + 1]} ${vertices[v * c + 2]}\r\n`;
    }
    // UV
    if (UV0 && UV0.length > 0) {
        c = 4;
        if (UV0.length == vertexCount * 2) {
            c = 2;
        } else if (UV0.length == vertexCount * 3) {
            c = 3;
        }
        for (let v = 0; v < vertexCount; v++) {
            file += `vt ${UV0[v * c]} ${UV0[v * c + 1]}\r\n`;
        }
    }
    // Normals
    if (normals && normals.length > 0) {
        if (UV0.length == vertexCount * 2) {
            c = 3;
        } else if (UV0.length == vertexCount * 3) {
            c = 4;
        }
        for (let v = 0; v < vertexCount; v++) {
            file += `vn ${-normals[v * c]} ${normals[v * c + 1]} ${normals[v * c + 2]}\r\n`;
        }
    }
    // Face
    let sum = 0;
    for (let i = 0; i < subMeshes.length; i++) {
        file += `g ${fileName}_${i}\r\n`;
        const indexCount = subMeshes[i].indexCount;
        const end = sum + indexCount / 3;
        for (let f = sum; f < end; f++) {
            const first = indices[f * 3 + 2] + 1;
            const second = indices[f * 3 + 1] + 1;
            const third = indices[f * 3] + 1;
            file += `f ${first}/${first}/${first} `;
            file += `${second}/${second}/${second} `;
            file += `${third}/${third}/${third}\r\n`;
        }
        sum = end;
    }

    file.replace("NaN", "0");

    return file;
};

export { getMesh };
