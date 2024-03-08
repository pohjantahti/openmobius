import { useEffect, useMemo, useRef, useState } from "react";
import { RouteOptions } from "../main-menu/Router";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import AssetList from "./components/AssetScrollList";
import { getAsset } from "@extractor/assetExtraction";
import AssetDisplay from "./components/AssetDisplay";
import { ClassID } from "@extractor/consts";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

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

function AssetViewer(props: Props) {
    const [assetList, setAssetList] = useState<AssetListJSON>([]);
    const [filterChips, setFilterChips] = useState<Record<number, boolean>>({
        28: true,
        43: true,
    });
    const [filterText, setFilterText] = useState("");

    const visibleAssetList = useMemo(() => {
        const list: Array<AssetListItem> = [];
        for (const container of assetList) {
            const tempList: Array<AssetListItem> = [];
            for (const asset of container.assets) {
                if (
                    filterChips[asset.classId] &&
                    asset.name?.toLowerCase().includes(filterText.toLowerCase())
                ) {
                    tempList.push({
                        container: container.container,
                        name: asset.name ? asset.name : ClassID[asset.classId],
                        type: "asset",
                        asset: {
                            classId: asset.classId,
                            pathId: asset.pathId,
                        },
                    });
                }
            }
            if (tempList.length > 0) {
                list.push({
                    container: container.container,
                    name: container.name,
                    type: "container",
                    asset: { classId: -1, pathId: "" },
                });
                list.push(...tempList);
            }
        }
        return list;
    }, [assetList, filterChips, filterText]);

    const inProgress = useRef(false);
    const [displayedAsset, setDisplayedAsset] = useState<{
        url: string;
        classId: number;
    }>();

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

    const handleDisplayedAsset = async (containerPath: string, pathId: string, classId: number) => {
        const url = await getAsset(containerPath, pathId);
        setDisplayedAsset({
            url: url,
            classId: classId,
        });
    };

    const handleChipFiltering = (classId: 28 | 43) => {
        filterChips[classId] = !filterChips[classId];
        setFilterChips({ ...filterChips });
    };

    const handleTextFiltering = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
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
                                justifyContent: "space-between",
                            }}
                        >
                            <FormControl variant="outlined" size="small">
                                <InputLabel>Asset name</InputLabel>
                                <OutlinedInput
                                    label="Asset name"
                                    value={filterText}
                                    onChange={handleTextFiltering}
                                    endAdornment={
                                        filterText.length > 0 && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => setFilterText("")}
                                                >
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                />
                            </FormControl>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label="Texture2D"
                                    color="primary"
                                    variant={filterChips[28] ? "filled" : "outlined"}
                                    onClick={() => handleChipFiltering(28)}
                                />
                                <Chip
                                    label="Mesh"
                                    color="primary"
                                    variant={filterChips[43] ? "filled" : "outlined"}
                                    onClick={() => handleChipFiltering(43)}
                                />
                            </Stack>
                            <AssetList
                                assetList={visibleAssetList}
                                handleDisplayedAsset={handleDisplayedAsset}
                            />
                        </Box>
                    )}
                </Stack>
            </Paper>
            <Paper sx={{ width: 1, height: 1, padding: 1 }}>
                {displayedAsset && <AssetDisplay displayedAsset={displayedAsset} />}
            </Paper>
        </Stack>
    );
}

export default AssetViewer;
export type { AssetListItem };
