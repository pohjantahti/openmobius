import { useEffect } from "react";
import { battle, initBattle } from "../../battle";
import BackgroundImages from "./BackgroundImages";
import ElementWheels from "./ElementWheels";

interface Props {
    combatInProgress: boolean;
    handleCombatEnd: () => void;
}

function BattleScreen(props: Props) {
    const { combatInProgress, handleCombatEnd } = props;

    useEffect(() => {
        initBattle();
    }, []);

    return (
        <div
            style={{
                display: combatInProgress ? "inline" : "none",
                height: "100%",
                width: "100%",
            }}
        >
            <BackgroundImages />

            <ElementWheels
                elements={{
                    main: ["fire", "water", "earth"],
                    sub: ["fire", "light", "dark"],
                }}
                wheel={{
                    main: [100 / 3, 100 / 3, 100 / 3],
                    sub: [100 / 3, 100 / 3, 100 / 3],
                }}
            />

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
