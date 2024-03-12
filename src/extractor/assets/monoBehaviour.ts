import BinaryReader from "@extractor/binaryReader";
import { Pointer, getPointer } from "./utils";
import { AssetInfo } from "@extractor/assetExtraction";
import { TypeNode } from "@extractor/containerExtraction";

const getMonoBehaviour = (reader: BinaryReader, assetInfo: AssetInfo) => {
    const monoBehaviourData = getMonoBehaviourData(reader, assetInfo);
    const file = JSON.stringify(monoBehaviourData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface MonoBehaviour {
    gameObject: Pointer;
    enabled: boolean;
    script: Pointer;
    name: string;
    other: ValueObject;
}

const getMonoBehaviourData = (reader: BinaryReader, assetInfo: AssetInfo): MonoBehaviour => {
    const gameObject = getPointer(reader);
    const enabled = reader.readBoolean();
    reader.align();
    const script = getPointer(reader);
    const name = reader.readAlignedString();

    reader.position = assetInfo.byteStart;
    const valueObject: ValueObject = {};
    const nodes = assetInfo.types.nodes;
    for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const nameStr = node.name;
        const { value, loopIndex } = readValue(reader, nodes, i);
        valueObject[nameStr] = value;
        i = loopIndex;
    }

    const other: ValueObject = {};
    for (const [key, value] of Object.entries(valueObject)) {
        if (
            key !== "m_GameObject" &&
            key !== "m_Enabled" &&
            key !== "m_Script" &&
            key !== "m_Name"
        ) {
            other[key] = value;
        }
    }

    return {
        gameObject: gameObject,
        enabled: enabled,
        script: script,
        name: name,
        other: other,
    };
};

type Value = string | number | boolean | object | Array<ValueObject> | Array<Value>;
type ValueObject = Record<string, Value>;

const readValue = (
    reader: BinaryReader,
    nodes: Array<TypeNode>,
    i: number
): { value: Value; loopIndex: number } => {
    const node = nodes[i];
    const typeStr = node.type;
    let value: Value;
    let align = (node.metaFlag & 0x4000) !== 0;
    switch (typeStr) {
        case "SInt8":
            value = reader.readI8();
            break;
        case "UInt8":
            value = reader.readU8();
            break;
        case "char": {
            const decoder = new TextDecoder();
            value = decoder.decode(reader.readBytes(2));
            break;
        }
        case "short":
        case "SInt16":
            value = reader.readI16();
            break;
        case "unsigned short":
        case "UInt16":
            value = reader.readU16();
            break;
        case "int":
        case "SInt32":
            value = reader.readI32();
            break;
        case "unsignedd int":
        case "UInt32":
        case "Type*":
            value = reader.readI32();
            break;
        case "long long":
        case "SInt64":
            value = reader.readI64().toString();
            break;
        case "unsigned long long":
        case "UInt64":
        case "FileSize":
            value = reader.readU64().toString();
            break;
        case "float":
            value = reader.readFloat();
            break;
        case "double":
            value = reader.readFloat64();
            break;
        case "bool":
            value = reader.readBoolean();
            break;
        case "string": {
            value = reader.readAlignedString();
            const toSkip = getNodes(nodes, i);
            i += toSkip.length - 1;
            break;
        }
        case "map":
            throw new Error("Unsupported type: map");
            break;
        case "TypelessData": {
            const size = reader.readI32();
            value = reader.readBytes(size);
            i += 2;
            break;
        }
        default:
            if (i < nodes.length - 1 && nodes[i + 1].type === "Array") {
                if ((nodes[i + 1].metaFlag & 0x0400) != 0) {
                    align = true;
                }
                const vector = getNodes(nodes, i);
                i += vector.length - 1;
                const size = reader.readI32();
                const list: Array<Value> = [];
                for (let j = 0; j < size; j++) {
                    const tmp = 3;
                    list.push(readValue(reader, vector, tmp).value);
                }
                value = list;
                break;
            } else {
                const _class = getNodes(nodes, i);
                i += _class.length - 1;
                const obj: ValueObject = {};
                for (let j = 1; j < _class.length; j++) {
                    const classMember = _class[j];
                    const name = classMember.name;
                    const { value, loopIndex } = readValue(reader, _class, j);
                    obj[name] = value;
                    j = loopIndex;
                }
                value = obj;
                break;
            }
    }

    if (align) {
        reader.align();
    }

    return {
        value: value,
        loopIndex: i,
    };
};

const getNodes = (nodes: Array<TypeNode>, index: number): Array<TypeNode> => {
    const nodeList: Array<TypeNode> = [];
    nodeList.push(nodes[index]);
    const level = nodes[index].level;
    for (let i = index + 1; i < nodes.length; i++) {
        const member = nodes[i];
        if (member.level <= level) {
            return nodeList;
        }
        nodeList.push(member);
    }
    return nodeList;
};

export { getMonoBehaviour };
