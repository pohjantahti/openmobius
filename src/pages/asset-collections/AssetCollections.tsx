import { useState } from "react";
import ControlAndDisplayAreas from "../asset-viewer/components/ControlAndDisplayAreas";
import DisplayArea from "./components/DisplayArea";
import LeftBar from "./components/LeftBar";

function AssetCollections() {
    const [selectedJobId, setSelectedJobId] = useState("");

    const handleSelectedJobId = async (newJobId: string) => {
        setSelectedJobId(newJobId);
    };

    return (
        <ControlAndDisplayAreas
            left={<LeftBar handleSelectedJobId={handleSelectedJobId} />}
            leftWidth={"415px"}
            right={<DisplayArea jobId={selectedJobId} />}
        />
    );
}

export default AssetCollections;
