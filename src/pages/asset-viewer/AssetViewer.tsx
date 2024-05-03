import { useState } from "react";
import { getAsset } from "@extractor/assetExtraction";
import { Stack } from "@mui/material";
import AssetDisplay from "./components/AssetDisplay";
import TabPanels from "./components/TabPanels";

interface DisplayedAsset {
    url: string;
    classId: number;
    collection: boolean;
}

function AssetViewer() {
    const [displayedAsset, setDisplayedAsset] = useState<DisplayedAsset>();

    const handleDisplayedAsset = async (
        containerPath: string,
        id: string,
        classId: number,
        collection = false
    ) => {
        let url = id;
        if (!collection) {
            url = await getAsset(containerPath, id);
        }

        setDisplayedAsset({
            url: url,
            classId: classId,
            collection: collection,
        });
    };

    return (
        <Stack direction="row">
            <TabPanels handleDisplayedAsset={handleDisplayedAsset} />
            <AssetDisplay displayedAsset={displayedAsset} />
        </Stack>
    );
}

export default AssetViewer;
export type { DisplayedAsset };
