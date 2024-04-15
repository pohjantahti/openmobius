import { useState } from "react";
import ControlAndDisplayAreas from "../asset-viewer/components/ControlAndDisplayAreas";
import { RouteOptions } from "../main-menu/Router";
import DisplayArea from "./components/DisplayArea";
import LeftBar from "./components/LeftBar";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function AssetCollections(props: Props) {
    const { setRoute } = props;

    const [selectedJobId, setSelectedJobId] = useState("");

    const handleSelectedJobId = async (newJobId: string) => {
        setSelectedJobId(newJobId);
    };

    return (
        <ControlAndDisplayAreas
            left={<LeftBar setRoute={setRoute} handleSelectedJobId={handleSelectedJobId} />}
            leftWidth={"415px"}
            right={<DisplayArea jobId={selectedJobId} />}
        />
    );
}

export default AssetCollections;
