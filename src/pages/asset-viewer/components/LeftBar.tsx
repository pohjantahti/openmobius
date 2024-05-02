import { useContext, useMemo, useState } from "react";
import {
    Button,
    Chip,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
} from "@mui/material";
import AssetList from "./AssetScrollList";
import { RouteContext } from "../../Router";
import { AssetListItem, AssetListJSON } from "../AssetViewer";
import { ClassID } from "@extractor/consts";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface Props {
    assetList: AssetListJSON;
    handleDisplayedAsset: (containerPath: string, pathId: string, classId: number) => void;
}

function LeftBar(props: Props) {
    const { assetList, handleDisplayedAsset } = props;
    const setRoute = useContext(RouteContext);

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

    return (
        <Stack spacing={1} sx={{ height: 1, width: 1 }}>
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => setRoute && setRoute("mainMenu")}>
                    Back
                </Button>
                <Typography variant="h5">Asset Viewer</Typography>
            </Stack>
            {assetList.length === 0 ? (
                <Stack justifyContent="center" alignItems="center" height={1}>
                    <Typography variant="body1">Loading...</Typography>
                    <CircularProgress />
                </Stack>
            ) : (
                <Stack justifyContent="space-between" height={1}>
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
                    <AssetList
                        assetList={visibleAssetList}
                        handleDisplayedAsset={handleDisplayedAsset}
                    />
                </Stack>
            )}
        </Stack>
    );
}

export default LeftBar;
