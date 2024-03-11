import ControlAndDisplayAreas from "../asset-viewer/components/ControlAndDisplayAreas";
import { RouteOptions } from "../main-menu/Router";
import DisplayArea from "./components/DisplayArea";
import LeftBar from "./components/LeftBar";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function AssetCollections(props: Props) {
    const { setRoute } = props;

    return (
        <ControlAndDisplayAreas
            left={<LeftBar setRoute={setRoute} />}
            leftWidth={"415px"}
            right={<DisplayArea />}
        />
    );
}

export default AssetCollections;
