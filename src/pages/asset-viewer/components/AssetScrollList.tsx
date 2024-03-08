import { List, ListSubheader } from "@mui/material";
import { AssetListJSON } from "../AssetViewer";
import ScrollListItem from "./ScrollListItem";

interface Props {
    assetList: AssetListJSON;
    handleDisplayedAsset: (containerPath: string, pathId: string, classId: number) => void;
}
function AssetList(props: Props) {
    return (
        <List
            sx={{ overflowY: "auto", maxHeight: "750px" }}
            subheader={<ListSubheader>Containers and assets</ListSubheader>}
            dense
        >
            {props.assetList.map((container, index) => (
                <ScrollListItem
                    key={index}
                    container={container}
                    handleDisplayedAsset={props.handleDisplayedAsset}
                />
            ))}
        </List>
    );
}

export default AssetList;
