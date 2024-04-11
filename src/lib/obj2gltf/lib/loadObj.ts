// Derivative work of "loadObj.js"
// Most of the function names, variable names, logic, etc. used in this
// file are originally from "lib/loadObj.js" of "obj2gltf" project.
// https://github.com/CesiumGS/obj2gltf

// See "../LICENSE.md" for license information.

class Node {
    name: string | undefined;
    meshes: Array<Mesh>;
    constructor() {
        this.name = undefined;
        this.meshes = [];
    }
}

class Mesh {
    name: string | undefined;
    primitives: Array<Primitive>;
    constructor() {
        this.name = undefined;
        this.primitives = [];
    }
}

class Primitive {
    material: undefined;
    indices: Array<number>;
    positions: Array<number>;
    normals: Array<number>;
    uvs: Array<number>;
    constructor() {
        this.material = undefined;
        this.indices = [];
        this.positions = [];
        this.normals = [];
        this.uvs = [];
    }
}

// OBJ regex patterns are modified from ThreeJS (https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js)
const vertexPattern = /v(\s+[\d|.|+|\-|e|E]+)(\s+[\d|.|+|\-|e|E]+)(\s+[\d|.|+|\-|e|E]+)/; // v float float float
const normalPattern = /vn(\s+[\d|.|+|\-|e|E]+)(\s+[\d|.|+|\-|e|E]+)(\s+[\d|.|+|\-|e|E]+)/; // vn float float float
const uvPattern = /vt(\s+[\d|.|+|\-|e|E]+)(\s+[\d|.|+|\-|e|E]+)/; // vt float float
const facePattern = /(-?\d+)\/?(-?\d*)\/?(-?\d*)/g; // for any face format "f v", "f v/v", "f v//v", "f v/v/v"

const loadObj = async (objPath: string) => {
    // Global store of vertex attributes listed in the obj file
    const globalPositions: Array<number> = [];
    const globalNormals: Array<number> = [];
    const globalUvs: Array<number> = [];

    // The current node, mesh, and primitive
    let node: Node;
    let mesh: Mesh;
    let primitive: Primitive;

    // All nodes seen in the obj
    const nodes: Array<Node> = [];

    // Used to build the indices. The vertex cache is unique to each primitive.
    let vertexCache: Record<string, number> = {};
    const vertexCacheLimit = 1000000;
    let vertexCacheCount = 0;
    let vertexCount = 0;

    // Buffers for face data that spans multiple lines
    let lineBuffer = "";

    // Used for parsing face data
    let faceVertices: Array<string> = [];
    let facePositions: Array<number> = [];
    let faceUvs: Array<number> = [];
    let faceNormals: Array<number> = [];

    function clearVertexCache() {
        vertexCache = {};
        vertexCacheCount = 0;
    }

    function getName(name?: string) {
        return name === "" ? undefined : name;
    }

    function addNode(name?: string) {
        node = new Node();
        node.name = getName(name);
        nodes.push(node);
        addMesh();
    }

    function addMesh(name?: string) {
        mesh = new Mesh();
        mesh.name = getName(name);
        node.meshes.push(mesh);
        addPrimitive();
    }

    function addPrimitive() {
        primitive = new Primitive();
        mesh.primitives.push(primitive);

        // Clear the vertex cache for each new primitive
        clearVertexCache();
        vertexCount = 0;
    }

    function getIndexFromStart(index: number, attributeData: Array<number>, components: number) {
        if (index < 0) {
            // Negative vertex indexes reference the vertices immediately above it
            return attributeData.length / components + index;
        }
        return index - 1;
    }

    function correctAttributeIndices(
        attributeIndices: Array<number>,
        attributeData: Array<number>,
        components: number
    ) {
        const length = attributeIndices.length;
        for (let i = 0; i < length; ++i) {
            if (attributeIndices[i]) {
                attributeIndices[i] = getIndexFromStart(
                    attributeIndices[i],
                    attributeData,
                    components
                );
            } else {
                throw new Error(`Attribute index is not present: ${attributeIndices[i]}`);
            }
        }
    }

    function correctVertices(
        vertices: Array<string>,
        positions: Array<number>,
        uvs: Array<number>,
        normals: Array<number>
    ) {
        const length = vertices.length;
        for (let i = 0; i < length; ++i) {
            vertices[i] = `${positions[i] ? positions[i] : ""}/${uvs[i] ? uvs[i] : ""}/${
                normals[i] ? normals[i] : ""
            }`;
        }
    }

    function createVertex(p: number, u: number, n: number) {
        // Positions
        if (globalPositions.length > 0) {
            if (p * 3 >= globalPositions.length) {
                throw new Error(`Position index ${p} is out of bounds`);
            }
            const px = globalPositions[p * 3];
            const py = globalPositions[p * 3 + 1];
            const pz = globalPositions[p * 3 + 2];
            primitive.positions.push(px);
            primitive.positions.push(py);
            primitive.positions.push(pz);
        }

        // Normals
        if (globalNormals.length > 0) {
            if (n * 3 >= globalNormals.length) {
                throw new Error(`Normal index ${n} is out of bounds`);
            }
            const nx = globalNormals[n * 3];
            const ny = globalNormals[n * 3 + 1];
            const nz = globalNormals[n * 3 + 2];
            primitive.normals.push(nx);
            primitive.normals.push(ny);
            primitive.normals.push(nz);
        }

        // UVs
        if (globalUvs.length > 0) {
            if (u * 2 >= globalUvs.length) {
                throw new Error(`UV index ${u} is out of bounds`);
            }
            const ux = globalUvs[u * 2];
            const uy = globalUvs[u * 2 + 1];
            primitive.uvs.push(ux);
            primitive.uvs.push(uy);
        }
    }

    // TODO: Track p u n and see which numbers are missing between 0 and globalArrays length
    function addVertex(v: string, p: number, u: number, n: number) {
        let index = vertexCache[v];
        if (!index) {
            index = vertexCount++;
            vertexCache[v] = index;
            createVertex(p, u, n);

            // Prevent the vertex cache from growing too large. As a result of clearing the cache there
            // may be some duplicate vertices.
            vertexCacheCount++;
            if (vertexCacheCount > vertexCacheLimit) {
                clearVertexCache();
            }
        }
        return index;
    }

    function addTriangle(index1: number, index2: number, index3: number) {
        primitive.indices.push(index1);
        primitive.indices.push(index2);
        primitive.indices.push(index3);
    }

    function addFace(
        vertices: Array<string>,
        positions: Array<number>,
        uvs: Array<number>,
        normals: Array<number>
    ) {
        correctAttributeIndices(positions, globalPositions, 3);
        correctAttributeIndices(normals, globalNormals, 3);
        correctAttributeIndices(uvs, globalUvs, 2);
        correctVertices(vertices, positions, uvs, normals);

        if (vertices.length === 3) {
            const index1 = addVertex(vertices[0], positions[0], uvs[0], normals[0]);
            const index2 = addVertex(vertices[1], positions[1], uvs[1], normals[1]);
            const index3 = addVertex(vertices[2], positions[2], uvs[2], normals[2]);
            addTriangle(index1, index2, index3);
        } else {
            throw new Error("Vertices length is not 3");
        }
    }

    function parseLine(line: string) {
        line = line.trim();
        let result;

        if (line.length === 0 || line.charAt(0) === "#") {
            // Don't process empty lines or comments
        } else if (/^o\s/i.test(line)) {
            const objectName = line.substring(2).trim();
            addNode(objectName);
        } else if (/^g\s/i.test(line)) {
            const groupName = line.substring(2).trim();
            addMesh(groupName);
        } else if ((result = vertexPattern.exec(line)) !== null) {
            globalPositions.push(parseFloat(result[1]));
            globalPositions.push(parseFloat(result[2]));
            globalPositions.push(parseFloat(result[3]));
        } else if ((result = normalPattern.exec(line)) !== null) {
            globalNormals.push(parseFloat(result[1]));
            globalNormals.push(parseFloat(result[2]));
            globalNormals.push(parseFloat(result[3]));
        } else if ((result = uvPattern.exec(line)) !== null) {
            globalUvs.push(parseFloat(result[1]));
            globalUvs.push(1.0 - parseFloat(result[2])); // Flip y so 0.0 is the bottom of the image
        } else {
            // face line or invalid line
            // Because face lines can contain n vertices, we use a line buffer in case the face data spans multiple lines.
            // If there's a line continuation don't create face yet
            if (line.slice(-1) === "\\") {
                lineBuffer += line.substring(0, line.length - 1);
                return;
            }
            lineBuffer += line;
            if (lineBuffer.substring(0, 2) === "f ") {
                while ((result = facePattern.exec(lineBuffer)) !== null) {
                    faceVertices.push(result[0]);
                    facePositions.push(parseInt(result[1]));
                    faceUvs.push(parseInt(result[2]));
                    faceNormals.push(parseInt(result[3]));
                }
                if (faceVertices.length > 2) {
                    addFace(faceVertices, facePositions, faceUvs, faceNormals);
                }

                faceVertices = [];
                facePositions = [];
                faceNormals = [];
                faceUvs = [];
            }
            lineBuffer = "";
        }
    }

    function removeEmptyMeshes(meshes: Array<Mesh>) {
        return meshes.filter(function (mesh: Mesh) {
            // Remove empty primitives
            mesh.primitives = mesh.primitives.filter(function (primitive: Primitive) {
                return primitive.indices.length > 0 && primitive.positions.length > 0;
            });
            // Valid meshes must have at least one primitive
            return mesh.primitives.length > 0;
        });
    }

    function meshesHaveNames(meshes: Array<Mesh>) {
        const meshesLength = meshes.length;
        for (let i = 0; i < meshesLength; ++i) {
            if (meshes[i].name) {
                return true;
            }
        }
        return false;
    }

    function removeEmptyNodes(nodes: Array<Node>) {
        const final = [];
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; ++i) {
            const node = nodes[i];
            const meshes = removeEmptyMeshes(node.meshes);
            if (meshes.length === 0) {
                continue;
            }
            node.meshes = meshes;
            if (!node.name && meshesHaveNames(meshes)) {
                // If the obj has groups (g) but not object groups (o) then convert meshes to nodes
                const meshesLength = meshes.length;
                for (let j = 0; j < meshesLength; ++j) {
                    const mesh = meshes[j];
                    const convertedNode = new Node();
                    convertedNode.name = mesh.name;
                    convertedNode.meshes = [mesh];
                    final.push(convertedNode);
                }
            } else {
                final.push(node);
            }
        }
        return final;
    }

    function setDefaultNames(
        items: Array<Mesh | Node>,
        defaultName: string,
        usedNames: Record<string, number>
    ) {
        const itemsLength = items.length;
        for (let i = 0; i < itemsLength; ++i) {
            const item = items[i];
            let name = item.name ? item.name : defaultName;
            const occurrences = usedNames[name];
            if (occurrences) {
                usedNames[name]++;
                name = `${name}_${occurrences}`;
            } else {
                usedNames[name] = 1;
            }
            item.name = name;
        }
    }

    function setDefaults(nodes: Array<Node>) {
        const usedNames = {};
        setDefaultNames(nodes, "Node", usedNames);
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; ++i) {
            const node = nodes[i];
            setDefaultNames(node.meshes, `${node.name}-Mesh`, usedNames);
        }
    }

    function cleanNodes(nodes: Array<Node>) {
        nodes = removeEmptyNodes(nodes);
        setDefaults(nodes);
        return nodes;
    }

    async function readLines(objPath: string, callBack: (line: string) => void) {
        const response = await fetch(objPath);
        const file = await response.text();
        const lines = file.split(/\r?\n/);
        for (const line of lines) {
            callBack(line);
        }
    }

    function finishLoading(nodes: Array<Node>, objPath: string) {
        nodes = cleanNodes(nodes);
        if (nodes.length === 0) {
            throw new Error(`${objPath} does not have any geometry data`);
        }
        return nodes;
    }

    // Create a default node in case there are no o/g/usemtl lines in the obj
    addNode();

    // Parse the obj file
    return await readLines(objPath, parseLine).then(function () {
        return finishLoading(nodes, objPath);
    });
};

export { loadObj };
