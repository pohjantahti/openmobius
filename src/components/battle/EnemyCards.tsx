import { useEffect, useState } from "react";
import EnemyActor from "../../battle/EnemyActor";
import { BattleAction } from "../../battle/types";
import { resources } from "../../extractor";
import { capitalize, sleep } from "../../utils";
import DamageTexts from "./DamageTexts";
import EnemyBoonAilmentBar from "./display/EnemyBoonAilmentBar";

interface Props {
    enemies: Array<EnemyActor>;
    targetIndex: number;
    handleBattleAction: (action: BattleAction, index?: number) => void;
    damageToEnemies: Array<{
        enemyIndex: number;
        hits: Array<{
            damage: number;
            critical?: boolean;
            weakness?: boolean;
            broken?: boolean;
        }>;
    }>;
    changingTarget: boolean;
    enemiesMoving: boolean;
}

function EnemyCards(props: Props) {
    const {
        enemies,
        targetIndex,
        handleBattleAction,
        damageToEnemies,
        changingTarget,
        enemiesMoving,
    } = props;

    const [showBreak, setShowBreak] = useState(false);

    useEffect(() => {
        const breakAnimation = async (enemy: EnemyActor) => {
            enemy.isBrokenAnimation = false;
            setShowBreak(true);
            await sleep(1000);
            setShowBreak(false);
        };
        enemies.forEach((enemy) => enemy.isBrokenAnimation && breakAnimation(enemy));
    }, [enemies, damageToEnemies]);

    return (
        <div
            style={{
                position: "absolute",
                top: "15rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            {enemies.map((enemy, index) => (
                <div
                    key={index}
                    style={{
                        position: "relative",
                        top: enemiesMoving && !enemy.isBroken ? "5rem" : "0rem",
                        margin: "5rem",
                        opacity: enemy.hp.current > 0 ? 1 : 0,
                        transition: "opacity 1s linear 0.5s, top 0.2s linear",
                    }}
                    onClick={
                        changingTarget && enemy.hp.current > 0
                            ? () => handleBattleAction(BattleAction.ChangeTarget, index)
                            : () => handleBattleAction(BattleAction.Tap)
                    }
                >
                    {/* Enemy HP and Break bar */}
                    <div
                        style={{
                            height: "4rem",
                            display: "flex",
                        }}
                    >
                        <img
                            src={resources["Icon: Battle_EnemyInfoBackground_Left"]}
                            style={{
                                height: "100%",
                            }}
                        />
                        <img
                            src={resources["Icon: Battle_EnemyInfoBackground_Middle"]}
                            style={{
                                height: "100%",
                                width: "10.6rem",
                            }}
                        />
                        <img
                            src={resources["Icon: Battle_EnemyInfoBackground_Right"]}
                            style={{
                                height: "100%",
                            }}
                        />
                        <img
                            src={resources[`Icon: ${capitalize(enemy.element)}Orb`]}
                            style={{
                                position: "absolute",
                                height: "2.5rem",
                                top: "0.7rem",
                                left: "2.8rem",
                            }}
                        />
                        {/* HP bar */}
                        <div
                            style={{
                                position: "absolute",
                                height: "0.9rem",
                                width: "11.1rem",
                                top: "1.1rem",
                                left: "5.6rem",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${(enemy.hp.current / enemy.hp.max) * 100}%`,
                                    background: "linear-gradient(#01F700, #006801)",
                                    transition: "width 0.4s",
                                }}
                            />
                        </div>
                        {/* Break bar */}
                        <div
                            style={{
                                position: "absolute",
                                height: "0.5vh",
                                width: "11.1rem",
                                top: "2.4rem",
                                left: "5.6rem",
                                display: "flex",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${
                                        (enemy.breakGauge.red.current / enemy.breakGauge.red.max) *
                                        100
                                    }%`,
                                    background: "linear-gradient(#D10000, #520200)",
                                    position: "absolute",
                                    transition: "width 0.4s",
                                }}
                            />
                            <div
                                style={{
                                    height: "100%",
                                    width: `${
                                        (enemy.breakGauge.yellow.current /
                                            enemy.breakGauge.yellow.max) *
                                        100
                                    }%`,
                                    background: "linear-gradient(#F67E03, #7D4206)",
                                    position: "absolute",
                                    transition: "width 0.4s",
                                }}
                            />
                        </div>
                    </div>

                    {/* Image and border */}
                    <div
                        style={{
                            width: "18rem",
                        }}
                    >
                        <img
                            src={resources[enemy.resources.card]}
                            style={{
                                position: "absolute",
                                width: "100%",
                                marginTop: "8%",
                            }}
                        />
                        <img
                            src={resources[enemy.resources.border]}
                            style={{
                                position: "absolute",
                                width: "100%",
                            }}
                        />
                    </div>

                    {/* Target hand */}
                    {targetIndex === index ? (
                        <div
                            style={{
                                position: "absolute",
                                height: "3rem",
                                top: "0.5rem",
                                left: "-1.3rem",
                                animation: "battleTargetHand 1s linear infinite",
                            }}
                        >
                            <img
                                src={resources["Icon: Battle_EnemyTargetHand"]}
                                style={{
                                    position: "absolute",
                                    height: "100%",
                                }}
                            />
                            {enemy.isBroken && (
                                <p
                                    style={{
                                        position: "absolute",
                                        top: "-1rem",
                                        left: "0.5rem",
                                        fontSize: "2.5rem",
                                        color: "#FF0000",
                                        filter: "url(#thinBlackOutlineFilter)",
                                    }}
                                >
                                    {enemy.breakLength.current}
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            {enemy.isBroken && (
                                <p
                                    style={{
                                        position: "absolute",
                                        top: "-0.75rem",
                                        fontSize: "2.5rem",
                                        color: "#FF0000",
                                        filter: "url(#thinBlackOutlineFilter)",
                                    }}
                                >
                                    {enemy.breakLength.current}
                                </p>
                            )}
                        </>
                    )}

                    <EnemyBoonAilmentBar effects={enemy.effects} />

                    <DamageTexts
                        damageHits={damageToEnemies.filter((x) => x.enemyIndex === index)[0]?.hits}
                        divName={"damageTextDiv"}
                    />
                </div>
            ))}

            <img
                src={resources["Billboard: Break"]}
                style={{
                    position: "absolute",
                    top: "20rem",
                    height: "8rem",
                    opacity: showBreak ? 1 : 0,
                    transition: "opacity 0.3s linear",
                }}
            />
        </div>
    );
}

export default EnemyCards;
