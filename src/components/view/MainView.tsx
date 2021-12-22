import BattleView from "./BattleView";
import Drawer from "../drawer/Drawer";
import RegionMap from "./RegionMap";
import { useState } from "react";
import { BattleNodeInfo } from "../../battle/types";

function MainView() {
    const [battleInProgress, setBattleInProgress] = useState(false);
    const [battleNodeInfo, setBattleNodeInfo] = useState<BattleNodeInfo>(Object());
    const [showButtons, setShowButtons] = useState(true);

    return (
        <>
            <RegionMap
                setBattleInProgress={setBattleInProgress}
                setBattleNodeInfo={setBattleNodeInfo}
                showButtons={showButtons}
                setShowButtons={setShowButtons}
            />
            <Drawer showButtons={showButtons} />
            <BattleView
                battleInProgress={battleInProgress}
                setBattleInProgress={setBattleInProgress}
                battleNodeInfo={battleNodeInfo}
            />
        </>
    );
}

export default MainView;
