import { tilesetList } from "./resourceLists";
import { extractResourceAsURL, extractResourceAsTextureInfo, getResourceInfo } from "./extractor";
import { createBitmapImage } from "./fileCreator";
import { ResourceInfo, TextureInfo } from "./types";

// Blob URL bank
const resources: Record<string, string> = {};

// Save icon tilesets for faster icon extraction
const tilesetImages: Record<string, TextureInfo> = {};

// Save Blob urls to the resources or tilesetImages
const saveResources = async (
    resourceList: Array<string>,
    name: string,
    onProgress?: (name: string, left: number, total: number) => void
): Promise<undefined> => {
    const startTime: number = Date.now();
    for (const [index, item] of Array.from(resourceList.entries())) {
        const resourceInfo = await getResourceInfo(item);
        if (tilesetList.includes(item)) {
            tilesetImages[item] = await extractResourceAsTextureInfo(resourceInfo);
        } else {
            resources[item] = await getResourceURL(item);
        }

        if (onProgress) {
            onProgress(name, index, resourceList.length);
        }
    }
    const endTime: number = (Date.now() - startTime) / 1000;
    console.log(
        `${name} completed in ${endTime} seconds with ${
            resourceList.length
        } resources. Average time per resource: ${(endTime / resourceList.length).toFixed(3)}`
    );
};

const getResourceURL = async (resource: string): Promise<string> => {
    const resourceInfo: ResourceInfo = await getResourceInfo(resource);
    if (tilesetList.includes(`Icon: ${resourceInfo.fileName}`)) {
        const { imageBuffer, width, height } = tilesetImages[`Icon: ${resourceInfo.fileName}`];
        return createBitmapImage(imageBuffer, resourceInfo, width, height);
    } else {
        return await extractResourceAsURL(resourceInfo);
    }
};

// TODO: Way to delete/unsave resources from resources object

export { saveResources, getResourceURL, resources };
