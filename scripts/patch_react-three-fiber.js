import { readFile, readdir, rm, writeFile } from "fs/promises";
import path from "path";

// Changes @react-three/fiber files in node_modules to not automatically
// convert the color space value of all the texture files to THREE.SRGBColorSpace.
// Needed for normal, metallic, roughness, etc. maps.
// Not the most ideal way to solve the issue, but it is what it is.

// Official fix is coming in the future with v9 of R3F
// https://github.com/pmndrs/react-three-fiber/pull/3163

const patches = [
    {
        file: "index-382d4f47.cjs.dev.js",
        changes: [
            {
                line: 670,
                content:
                    "const colorMaps = ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap', 'envMap']",
            },
            {
                line: 779,
                content:
                    "      if (colorMaps.includes(key) && currentInstance[key] instanceof THREE__namespace.Texture &&",
            },
        ],
    },
    {
        file: "index-d98fd1c7.esm.js",
        changes: [
            {
                line: 643,
                content:
                    "const colorMaps = ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap', 'envMap']",
            },
            {
                line: 752,
                content:
                    "      if (colorMaps.includes(key) && currentInstance[key] instanceof THREE.Texture &&",
            },
        ],
    },
    {
        file: "index-e8d6e828.cjs.prod.js",
        changes: [
            {
                line: 670,
                content:
                    "const colorMaps = ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap', 'envMap']",
            },
            {
                line: 779,
                content:
                    "      if (colorMaps.includes(key) && currentInstance[key] instanceof THREE__namespace.Texture &&",
            },
        ],
    },
];

const main = async () => {
    const folderPath = path.join(import.meta.dirname, "../node_modules/@react-three/fiber/dist");

    try {
        // Throws if @react-three/fiber hasn't been installed
        await readdir(folderPath);
        for (const patch of patches) {
            try {
                const file = await readFile(path.join(folderPath, patch.file), {
                    encoding: "utf-8",
                });

                const lines = file.split(/\r?\n/);
                for (const change of patch.changes) {
                    lines[change.line - 1] = change.content;
                }
                const newFile = lines.join("\n");

                await writeFile(path.join(folderPath, patch.file), newFile);
            } catch (error) {
                if (error.code === "ENOENT") {
                    throw new Error(`Cannot find file ${patch.file} in ${folderPath}`);
                } else {
                    throw new Error(error);
                }
            }
        }
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("Could not find @react-three/fiber in node_modules. Is it installed?");
        } else {
            throw new Error(error);
        }
    }

    // Remove old files cached by vite
    try {
        await rm(path.join(import.meta.dirname, "../node_modules/.vite/deps"), {
            recursive: true,
            force: true,
        });
    } catch (error) {
        throw new Error(error);
    }

    console.log("Succesfully patched!");
};

main();
