import BattleView from "./BattleView";
import Drawer from "../drawer/Drawer";
import RegionMapView from "./RegionMap";
import { useState } from "react";

function MainView() {
    const [battleInProgress, setBattleInProgress] = useState(false);
    // const [battleEnemyList, setBattleEnemyList] = useState([]);

    return (
        <>
            <RegionMapView setBattleInProgress={setBattleInProgress} />
            <Drawer />
            <BattleView
                battleInProgress={battleInProgress}
                setBattleInProgress={setBattleInProgress}
            />
        </>
    );
}

export default MainView;
