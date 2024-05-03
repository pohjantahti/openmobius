import { ClassID } from "@extractor/consts";
import {
    Chip,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect, useMemo, useRef, useState } from "react";
import AssetList from "./AssetScrollList";

interface Props {
    currentTab: number;
    index: number;
    handleDisplayedAsset: (
        containerPath: string,
        pathId: string,
        classId: number,
        collection?: boolean
    ) => void;
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

function SingleViewerPanel(props: Props) {
    const { currentTab, index, handleDisplayedAsset } = props;
    const [assetList, setAssetList] = useState<AssetListJSON>([]);
    const inProgress = useRef(false);

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

    const handleChipFiltering = (classId: 28 | 43) => {
        filterChips[classId] = !filterChips[classId];
        setFilterChips({ ...filterChips });
    };

    const handleTextFiltering = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(event.target.value);
    };

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

    return (
        <div hidden={currentTab !== index}>
            {assetList.length === 0 ? (
                <Stack justifyContent="center" alignItems="center" height={1}>
                    <Typography variant="body1">Loading...</Typography>
                    <CircularProgress />
                </Stack>
            ) : (
                <Stack spacing={1} justifyContent="space-between" height={1} marginTop={1}>
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
                                            size="small"
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
                    <Divider />
                    <AssetList
                        assetList={visibleAssetList}
                        handleDisplayedAsset={handleDisplayedAsset}
                    />
                </Stack>
            )}
        </div>
    );
}

export default SingleViewerPanel;
export type { AssetListItem };
