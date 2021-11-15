import BattleView from "./BattleView";
import Drawer from "../drawer/Drawer";
import RegionMapView from "./RegionMap";
import { useState } from "react";

function MainView() {
    const [battleInProgress, setBattleInProgress] = useState(false);
    const [battleNodeInfo, setBattleNodeInfo] = useState<{ waves: number }>(Object());
    // const [battleEnemyList, setBattleEnemyList] = useState([]);

    return (
        <>
            <RegionMapView
                setBattleInProgress={setBattleInProgress}
                setBattleNodeInfo={setBattleNodeInfo}
            />
            <Drawer />
            <BattleView
                battleInProgress={battleInProgress}
                setBattleInProgress={setBattleInProgress}
                battleNodeInfo={battleNodeInfo}
            />
        </>
    );
}

export default MainView;
