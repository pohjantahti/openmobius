/*
    This file is a mixture from following sources:
    - BinaryReaderExtensions class in AssetStudio
    - BinaryReader class in shibunyan and SyncReader class in binarin

    Check "../LICENSES" for links to relevant projects.
*/

class BinaryReader {
    dataView: DataView;
    position: number;
    isLittleEndian: boolean;

    constructor(dataView: DataView, position: number = 0, endian = false) {
        this.dataView = dataView;
        this.position = position;
        this.isLittleEndian = endian;
    }

    align(align: number = 4): void {
        const remainder = this.position % align;
        if (remainder !== 0) {
            this.position += align - remainder;
        }
    }

    readByte(): ArrayBuffer {
        const value = this.dataView.buffer.slice(this.position, this.position + 1);
        this.position++;
        return value;
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

    readI64(): BigInt {
        const value = this.dataView.getBigInt64(this.position, this.isLittleEndian);
        this.position += 8;
        return value;
    }

    readU64(): BigInt {
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

    readFloat(): number {
        const value = this.dataView.getFloat32(this.position, this.isLittleEndian);
        this.position += 4;
        return value;
    }

    readBoolean(): boolean {
        const value = this.dataView.getInt8(this.position) !== 0;
        this.position++;
        return value;
    }
}

export default BinaryReader;
