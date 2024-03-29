import BinaryReader from "@extractor/binaryReader";

const getMonoScript = (reader: BinaryReader) => {
    const monoScriptData = getMonoScriptData(reader);
    const file = JSON.stringify(monoScriptData);

    const blob = new Blob([file], { type: "application/json" });
    return window.URL.createObjectURL(blob);
};

interface MonoScript {
    executionOrder: number;
    propertiesHash: ArrayBuffer;
    className: string;
    nameSpace: string;
    assemblyName: string;
    isEditorScript: boolean;
}

const getMonoScriptData = (reader: BinaryReader): MonoScript => {
    return {
        executionOrder: reader.readI32(),
        propertiesHash: reader.readBytes(16),
        className: reader.readAlignedString(),
        nameSpace: reader.readAlignedString(),
        assemblyName: reader.readAlignedString(),
        isEditorScript: reader.readBoolean(),
    };
};

export { getMonoScript, getMonoScriptData };
export type { MonoScript };
