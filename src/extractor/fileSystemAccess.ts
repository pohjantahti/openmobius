let baseDirectoryHandle: FileSystemDirectoryHandle;

const setBaseDirectoryHandle = async (): Promise<void> => {
    // Check for browser support
    if (typeof window.showDirectoryPicker !== "function") {
        throw new Error("Browser does not support File System Access API.");
    }
    baseDirectoryHandle = await window.showDirectoryPicker();
    // Check that the folder is correct
    const directoriesNeeded = ["mobius_data", "StreamingAssets"];
    for await (const item of baseDirectoryHandle.values()) {
        if (item.kind === "directory" && directoriesNeeded.includes(item.name)) {
            directoriesNeeded.splice(directoriesNeeded.indexOf(item.name));
        }
    }
    if (directoriesNeeded.length !== 0) {
        throw new Error('Directory does not contain folders "mobius_data" and "StreamingAssets"');
    }
};

const getHashFileList = async (): Promise<Array<string>> => {
    // Get Hash folder
    let hashDir = await baseDirectoryHandle.getDirectoryHandle("mobius_data");
    hashDir = await hashDir.getDirectoryHandle("Hash");
    // List all the .unity3d files
    const list = [];
    for await (const folder of hashDir.values()) {
        const u3dDir = await hashDir.getDirectoryHandle(folder.name);
        for await (const fileName of u3dDir.keys()) {
            list.push(`${folder.name}/${fileName}`);
        }
    }
    return list;
};

const readFile = async (path: string) => {
    let subDirectoryHandle = baseDirectoryHandle;
    const paths = path.split("/");
    const fileName = paths.splice(paths.length - 1, 1)[0];
    for (const subPath of paths) {
        if (subPath.length > 0) {
            subDirectoryHandle = await subDirectoryHandle.getDirectoryHandle(subPath);
        }
    }
    const fileHandle = await subDirectoryHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.arrayBuffer();
};

export { setBaseDirectoryHandle, getHashFileList, readFile };
