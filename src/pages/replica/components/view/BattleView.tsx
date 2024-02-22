import { useEffect, useState } from "react";
import { BattleNodeInfo } from "../../battle/types";
import BattleScreen from "../battle/BattleScreen";
import ResultsScreen from "../battle/ResultsScreen";

interface Props {
    battleInProgress: boolean;
    setBattleInProgress: React.Dispatch<React.SetStateAction<boolean>>;
    battleNodeInfo: BattleNodeInfo;
}

function BattleView(props: Props) {
    const { battleInProgress, setBattleInProgress, battleNodeInfo } = props;

    const [combatInProgress, setCombatInProgress] = useState(false);
    const [resultsInProgress, setResultsInProgress] = useState(false);
    const [scoreInfo, setScoreInfo] = useState({
        score: 0,
        seedBonus: 1,
        bestScore: 0,
    });

    useEffect(() => {
        if (battleInProgress) {
            setCombatInProgress(true);
        }
    }, [battleInProgress]);

    const handleCombatEnd = (score: number) => {
        setCombatInProgress(false);
        setResultsInProgress(true);
        setScoreInfo({
            score: score,
            seedBonus: 1,
            bestScore: 0,
        });
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
                    }}
                >
                    {combatInProgress && (
                        <BattleScreen
                            handleCombatEnd={handleCombatEnd}
                            battleNodeInfo={battleNodeInfo}
                        />
                    )}
                    {resultsInProgress && (
                        <ResultsScreen handleResultsEnd={handleResultsEnd} info={scoreInfo} />
                    )}
                </div>
            )}
        </>
    );
}

export default BattleView;
