import BattleView from "./BattleView";
import Drawer from "../drawer/Drawer";
import RegionMap from "./RegionMap";
import { useState } from "react";
import { Enemy } from "../../data/game/enemies";

function MainView() {
    const [battleInProgress, setBattleInProgress] = useState(false);
    const [battleNodeInfo, setBattleNodeInfo] = useState<{
        enemies: Array<Array<Enemy>>;
        difficulty: number;
        battleResources: Record<string, string>;
    }>(Object());

    return (
        <>
            <RegionMap
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
