import { useEffect, useRef, useState } from "react";
import ControlAndDisplayAreas from "../asset-viewer/components/ControlAndDisplayAreas";
import { RouteOptions } from "../main-menu/Router";
import DisplayArea from "./components/DisplayArea";
import LeftBar from "./components/LeftBar";
import { SceneRenderer } from "@renderer/sceneRenderer";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function AssetCollections(props: Props) {
    const { setRoute } = props;

    const [selectedJobId, setSelectedJobId] = useState("");
    const renderer = useRef<SceneRenderer>();

    useEffect(() => {
        renderer.current = new SceneRenderer("jobDisplay", 700, 700);

        const displayDiv = document.getElementById("jobDisplay");
        if (displayDiv && displayDiv.firstChild && displayDiv.children.length > 1) {
            displayDiv.removeChild(displayDiv.firstChild);
        }

        return () => {
            renderer.current?.unloadEverything();
        };
    }, []);

    const handleSelectedJobId = async (newJobId: string) => {
        await renderer.current?.loadJob(newJobId);
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
