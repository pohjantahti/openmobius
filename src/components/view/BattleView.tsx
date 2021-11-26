import { useEffect, useState } from "react";
import { Enemy } from "../../data/game/enemies";
import BattleScreen from "../battle/BattleScreen";
import ResultsScreen from "../battle/ResultsScreen";

interface Props {
    battleInProgress: boolean;
    setBattleInProgress: React.Dispatch<React.SetStateAction<boolean>>;
    battleNodeInfo: {
        enemies: Array<Array<Enemy>>;
        difficulty: number;
        battleResources: Record<string, string>;
    };
}

function BattleView(props: Props) {
    const { battleInProgress, setBattleInProgress, battleNodeInfo } = props;

    const [combatInProgress, setCombatInProgress] = useState(false);
    const [resultsInProgress, setResultsInProgress] = useState(false);

    useEffect(() => {
        if (battleInProgress) {
            setCombatInProgress(true);
        }
    }, [battleInProgress]);

    const handleCombatEnd = () => {
        setCombatInProgress(false);
        setResultsInProgress(true);
    };

    const handleResultsEnd = () => {
        setResultsInProgress(false);
        setBattleInProgress(false);
    };

    return (
        <>
            {battleInProgress && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: "100%",
                        zIndex: 15,
                        backgroundColor: "black",
                    }}
                >
                    <BattleScreen
                        combatInProgress={combatInProgress}
                        handleCombatEnd={handleCombatEnd}
                        battleNodeInfo={battleNodeInfo}
                    />
                    <ResultsScreen
                        resultsInProgress={resultsInProgress}
                        handleResultsEnd={handleResultsEnd}
                    />
                </div>
            )}
        </>
    );
}

export default BattleView;
