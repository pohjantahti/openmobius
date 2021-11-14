import BattleView from "./BattleView";
import Drawer from "../drawer/Drawer";
import RegionMapView from "../map/RegionMap";

function MainView() {
    return (
        <>
            <RegionMapView />
            <Drawer />
            <BattleView />
        </>
    );
}

export default MainView;
