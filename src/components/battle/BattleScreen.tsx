import { useEffect, useState } from "react";
import { battle, initBattle } from "../../battle";
import { currentDeck, deckInfo } from "../../info";
import BackgroundImages from "./BackgroundImages";
import ElementWheels from "./ElementWheels";
import Buttons from "./button/Buttons";
import ScoreWaveBar from "./bar/ScoreWaveBar";
import { BattleInfo } from "../../battle/Battle";

interface Props {
    combatInProgress: boolean;
    handleCombatEnd: () => void;
    battleNodeInfo: { waves: number };
}

function BattleScreen(props: Props) {
    const { combatInProgress, handleCombatEnd, battleNodeInfo } = props;

    const [battleInfo, setBattleInfo] = useState<BattleInfo>(Object());

    useEffect(() => {
        initBattle({
            deck: deckInfo[currentDeck],
            waves: battleNodeInfo.waves,
        });
        setBattleInfo(battle.getBattleInfo());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // This is needed till the first time setBattleInfo is called in useEffect
    if (Object.keys(battleInfo).length === 0) {
        return null;
    }

    return (
        <div
            style={{
                display: combatInProgress ? "inline" : "none",
                height: "100%",
                width: "100%",
            }}
        >
            <BackgroundImages />

            <ElementWheels elementWheel={battleInfo.elementWheel} />

            <Buttons />
            <ScoreWaveBar score={battleInfo.score} wave={battleInfo.wave} />

            <button
                style={{
                    position: "absolute",
                    top: "50rem",
                    left: "70rem",
                }}
                onClick={handleCombatEnd}
            >
                End combat
            </button>
        </div>
    );
}

export default BattleScreen;
