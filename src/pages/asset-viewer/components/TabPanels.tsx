import { useState } from "react";
import { Drawer, Tab, Tabs, Toolbar } from "@mui/material";
import SingleViewerPanel from "./SingleViewerPanel";
import CollectionViewerPanel from "./CollectionViewerPanel";

interface Props {
    handleDisplayedAsset: (
        containerPath: string,
        pathId: string,
        classId: number,
        collection?: boolean
    ) => void;
}

function TabPanels(props: Props) {
    const { handleDisplayedAsset } = props;
    const [currentTab, setCurrentTab] = useState(0);

    const handleChangeTab = (_: React.SyntheticEvent, newTab: number) => {
        setCurrentTab(newTab);
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 400,
                [`& .MuiDrawer-paper`]: {
                    width: 400,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar />
            <Tabs value={currentTab} onChange={handleChangeTab}>
                <Tab label="Singles" sx={{ width: "50%" }} />
                <Tab label="Collections" sx={{ width: "50%" }} />
            </Tabs>
            <SingleViewerPanel
                currentTab={currentTab}
                index={0}
                handleDisplayedAsset={handleDisplayedAsset}
            />
            <CollectionViewerPanel
                currentTab={currentTab}
                index={1}
                handleDisplayedAsset={handleDisplayedAsset}
            />
        </Drawer>
    );
}

export default TabPanels;
