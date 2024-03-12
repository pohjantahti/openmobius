/*
    BinaryReader was inspired by the following sources:
    - EndianBinaryReader and BinaryReaderExtensions classes in AssetStudio
    - BinaryReader class in shibunyan and SyncReader class in binarin

    Check "./LICENSES" for links to relevant projects.
*/

import { Quaternion, Vector3 } from "./assets/types";

class BinaryReader {
    dataView: DataView;
    position: number;
    isLittleEndian: boolean;

    constructor(arrayBuffer: ArrayBuffer, position: number = 0, endian = false) {
        this.dataView = new DataView(arrayBuffer);
        this.position = position;
        this.isLittleEndian = endian;
    }

    align(align: number = 4): void {
        const remainder = this.position % align;
        if (remainder !== 0) {
            this.position += align - remainder;
        }
    }

    readByte(): number {
        return this.readU8();
    }

    readBytes(length: number): ArrayBuffer {
        const value = this.dataView.buffer.slice(this.position, this.position + length);
        this.position += length;
        return value;
    }

    readI8(): number {
        const value = this.dataView.getInt8(this.position);
        this.position++;
        return value;
    }

    readU8(): number {
        const value = this.dataView.getUint8(this.position);
        this.position++;
        return value;
    }

    readI16(): number {
        const value = this.dataView.getInt16(this.position, this.isLittleEndian);
        this.position += 2;
        return value;
    }

    readU16(): number {
        const value = this.dataView.getUint16(this.position, this.isLittleEndian);
        this.position += 2;
        return value;
    }

    readI32(): number {
        const value = this.dataView.getInt32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    readU32(): number {
        const value = this.dataView.getUint32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    readI64(): bigint {
        const value = this.dataView.getBigInt64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    readU64(): bigint {
        const value = this.dataView.getBigUint64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    readStringToNull(): string {
        const bytes = [];
        while (this.position <= this.dataView.byteLength) {
            const byte = this.dataView.getInt8(this.position);
            this.position++;
            if (byte === 0) {
                break;
            } else {
                bytes.push(byte);
            }
        }
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(bytes).buffer);
    }

    readAlignedString(): string {
        let string: string = "";
        const length = this.readI32();
        if (length > 0 && length <= this.dataView.byteLength - this.position) {
            const stringData = this.readBytes(length);
            const decoder = new TextDecoder();
            this.align();
            string = decoder.decode(stringData);
        }
        return string;
    }

    readFloat(): number {
        const value = this.dataView.getFloat32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    readFloat64(): number {
        const value = this.dataView.getFloat64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    readBoolean(): boolean {
        const value = this.dataView.getInt8(this.position) !== 0;
        this.position++;
        return value;
    }

    readVector3(): Vector3 {
        return {
            x: this.readFloat(),
            y: this.readFloat(),
            z: this.readFloat(),
        };
    }

    readQuaternion(): Quaternion {
        return {
            x: this.readFloat(),
            y: this.readFloat(),
            z: this.readFloat(),
            w: this.readFloat(),
        };
    }

    readFloatArray(length = this.readI32()): Array<number> {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push(this.readFloat());
        }
        return array;
    }

    readU8Array(length = this.readI32()): Array<number> {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push(this.readU8());
        }
        return array;
    }

    readI32Array(length = this.readI32()): Array<number> {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push(this.readI32());
        }
        return array;
    }

    readU32Array(length = this.readI32()): Array<number> {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push(this.readU32());
        }
        return array;
    }

    readMatrixArray(length = this.readI32()): Array<Array<number>> {
        const array = [];
        for (let i = 0; i < length; i++) {
            array.push(this.readFloatArray(16));
        }
        return array;
    }
}

export default BinaryReader;
