import { useEffect, useRef, useState } from "react";
import { RouteOptions } from "../main-menu/Router";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import AssetList from "./components/AssetScrollList";
import { getAsset } from "@extractor/assetExtraction";

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

function AssetViewer(props: Props) {
    const [assetList, setAssetList] = useState<AssetListJSON>([]);
    const inProgress = useRef(false);
    const [displayedAsset, setDisplayedAsset] = useState<string>("");

    useEffect(() => {
        const fetchAssetList = async () => {
            inProgress.current = true;
            const listJSON = await fetch("./asset-viewer/containerAssets.json");
            const list: AssetListJSON = await listJSON.json();
            console.log("Asset list fetched");
            inProgress.current = false;
            setAssetList(list);
        };
        if (!inProgress.current) {
            fetchAssetList();
        }
    }, []);

    const handleDisplayedAsset = async (containerPath: string, pathId: string) => {
        const assetURL = await getAsset(containerPath, pathId);
        setDisplayedAsset(assetURL);
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
            <Paper sx={{ height: 1 }}>
                <Stack spacing={1} padding={1} sx={{ height: 1, width: "416px" }}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => props.setRoute("mainMenu")}>
                            Back
                        </Button>
                        <Typography variant="h5">Asset Viewer</Typography>
                    </Stack>
                    {assetList.length === 0 ? (
                        <Box
                            sx={{
                                height: 1,
                                width: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body1">Loading...</Typography>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: 1,
                                width: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                            }}
                        >
                            <AssetList
                                assetList={assetList}
                                handleDisplayedAsset={handleDisplayedAsset}
                            />
                        </Box>
                    )}
                </Stack>
            </Paper>
            <Paper sx={{ width: 1, height: 1, padding: 1 }}>
                <img src={displayedAsset} style={{ maxHeight: "100%" }} />
            </Paper>
        </Stack>
    );
}

export default AssetViewer;
export type { AssetListJSON };
