import { useEffect, useRef, useState } from "react";
import { RouteOptions } from "../main-menu/Router";
import { Stack } from "@mui/material";
import { getAsset } from "@extractor/assetExtraction";
import AssetDisplay from "./components/AssetDisplay";
import LeftBar from "./components/LeftBar";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

type AssetListJSON = Array<{
    container: string;
    name: string;
    assets: Array<{
        classId: number;
        pathId: string;
        name?: string;
    }>;
}>;

interface AssetListItem {
    container: string;
    type: "container" | "asset";
    name: string;
    asset: {
        classId: number;
        pathId: string;
    };
}

interface DisplayedAsset {
    url: string;
    classId: number;
}

function AssetViewer(props: Props) {
    const [assetList, setAssetList] = useState<AssetListJSON>([]);
    const [displayedAsset, setDisplayedAsset] = useState<DisplayedAsset>();
    const inProgress = useRef(false);

    useEffect(() => {
        const fetchAssetList = async () => {
            inProgress.current = true;
            const listJSON = await fetch("./assets/containerAssets.json");
            const list: AssetListJSON = await listJSON.json();
            console.log("Asset list fetched");
            inProgress.current = false;
            setAssetList(list);
        };
        if (!inProgress.current) {
            fetchAssetList();
        }
    }, []);

    const handleDisplayedAsset = async (containerPath: string, pathId: string, classId: number) => {
        const url = await getAsset(containerPath, pathId);
        setDisplayedAsset({
            url: url,
            classId: classId,
        });
    };

    return (
        <Stack
            direction="row"
            spacing={1}
            padding={1}
            sx={{
                position: "absolute",
                height: 1,
                width: 1,
            }}
        >
            <LeftBar
                assetList={assetList}
                setRoute={props.setRoute}
                handleDisplayedAsset={handleDisplayedAsset}
            />
            <AssetDisplay displayedAsset={displayedAsset} />
        </Stack>
    );
}

export default AssetViewer;
export type { AssetListJSON, AssetListItem, DisplayedAsset };
