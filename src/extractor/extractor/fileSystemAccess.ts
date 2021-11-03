let baseDirectoryHandle: FileSystemDirectoryHandle;

const setBaseDirectoryHandle = async (): Promise<boolean> => {
    baseDirectoryHandle = await window.showDirectoryPicker();
    const directoriesNeeded = ["mobius_data", "StreamingAssets"];
    for await (const item of baseDirectoryHandle.values()) {
        if (item.kind === "directory" && directoriesNeeded.includes(item.name)) {
            directoriesNeeded.splice(directoriesNeeded.indexOf(item.name));
        }
    }
    if (directoriesNeeded.length === 0) {
        return true;
    } else {
        throw new Error('Directory does not contain folders "mobius_data" and "StreamingAssets"');
    }
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

export { setBaseDirectoryHandle, readFile };
