import { ClassID } from "@extractor/consts";
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    List,
    Divider,
    Tooltip,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoIcon from "@mui/icons-material/Photo";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface Props {
    container: {
        container: string;
        name: string;
        assets: Array<{
            classId: number;
            pathId: string;
            name?: string;
        }>;
    };
    handleDisplayedAsset: (containerPath: string, pathId: string) => void;
}
function ScrollListItem(props: Props) {
    const { container, handleDisplayedAsset } = props;

    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleOpen}>
                <Tooltip title={container.container} placement="top" enterDelay={500}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                        <FolderIcon />
                    </ListItemIcon>
                </Tooltip>
                <ListItemText>{container.name}</ListItemText>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open}>
                <List dense disablePadding>
                    {container.assets.map((asset, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ paddingLeft: 5 }}
                            onClick={() => handleDisplayedAsset(container.container, asset.pathId)}
                        >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                {asset.classId === ClassID.Texture2D && <PhotoIcon />}
                                {asset.classId === ClassID.Mesh && <ViewInArIcon />}
                            </ListItemIcon>
                            <ListItemText>{asset.name || ClassID[asset.classId]}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
            <Divider />
        </>
    );
}

export default ScrollListItem;
