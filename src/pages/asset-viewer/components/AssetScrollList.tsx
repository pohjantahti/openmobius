import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { AssetListItem } from "../AssetViewer";
import { FixedSizeList } from "react-window";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoIcon from "@mui/icons-material/Photo";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { ClassID } from "@extractor/consts";

interface Props {
    assetList: Array<AssetListItem>;
    handleDisplayedAsset: (containerPath: string, pathId: string, classId: number) => void;
}

interface ScrollListItemProps {
    index: number;
    style: React.CSSProperties;
    item: AssetListItem;
}

function AssetList(props: Props) {
    const { assetList, handleDisplayedAsset } = props;

    const ScrollListItem = (props: ScrollListItemProps) => {
        const { index, style, item } = props;

        if (item.type === "container") {
            return (
                <ListItem style={{ ...style, paddingLeft: 2 }} key={index} dense>
                    <Tooltip title={item.container} placement="top" enterDelay={500}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            <FolderIcon />
                        </ListItemIcon>
                    </Tooltip>
                    <ListItemText>{item.name}</ListItemText>
                </ListItem>
            );
        } else {
            return (
                <ListItem style={style} key={index} dense>
                    <ListItemButton
                        sx={{ paddingLeft: 3 }}
                        onClick={() =>
                            handleDisplayedAsset(
                                item.container,
                                item.asset.pathId,
                                item.asset.classId
                            )
                        }
                    >
                        <ListItemIcon sx={{ minWidth: 30 }}>
                            {item.asset?.classId === ClassID.Texture2D && <PhotoIcon />}
                            {item.asset?.classId === ClassID.Mesh && <ViewInArIcon />}
                        </ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                    </ListItemButton>
                </ListItem>
            );
        }
    };

    return (
        <FixedSizeList
            height={750}
            width={400}
            itemCount={assetList.length}
            itemSize={35}
            style={{ marginLeft: 0, overflowY: "scroll" }}
        >
            {({ index, style }) => (
                <ScrollListItem index={index} style={style} item={assetList[index]} />
            )}
        </FixedSizeList>
    );
}

export default AssetList;
