import ModalBase from "./ModalBase";
import ModalButton from "./ModalButton";
import { resources } from "../../extractor";
import { MapNodeType } from "../../data/game/regions";
import React, { useState } from "react";
import {
    currentDeck,
    getCurrentDeckElements,
    getCurrentDeckLevel,
    getCurrentDeckName,
    MAX,
} from "../../info";
import DeckSelection from "../card/DeckSelection";
import { capitalize } from "../../utils";

interface Props {
    show: boolean;
    info: MapNodeType;
    handleModalClose: () => void;
}

function ConfirmBattleModal(props: Props) {
    const { show, info, handleModalClose } = props;

    // Used to force DeckSelectionBalls to rerender
    const [, refresher] = useState(0);

    const DifficultyMeter = () => {
        const elements = [];
        const difficulties: { [color: string]: number } = {
            black: 0,
            blue: 1,
            green: 2,
            yellow: 3,
            orange: 4,
            red: 5,
        };
        const difficulty = info.battleInfo.difficulty || difficulties[info.mapInfo.color];
        for (let i = 0; i < 5; i++) {
            elements.push(
                <img
                    key={i}
                    src={resources["Icon: ConfirmBattleDifficulty"]}
                    style={{
                        height: "3rem",
                        filter: difficulty > i ? `url(#difficulty${difficulty}Filter)` : "none",
                    }}
                />
            );
        }
        return <>{elements}</>;
    };

    const Warnings = (props: { warningsIndex: number }) => {
        return (
            <>
                {info.battleInfo.warnings[props.warningsIndex].map((warning, index) => (
                    <React.Fragment key={index}>
                        {warning.type === "text" && (
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: "1.7rem",
                                    lineHeight: "2rem",
                                }}
                            >
                                {warning.text}
                            </p>
                        )}
                        {warning.type === "image" && (
                            <img
                                src={resources[warning.text]}
                                style={{
                                    height: "2rem",
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    };

    const DeckSelectionBalls = () => {
        const decks: Array<boolean> = Array(MAX.deckCount).fill(false);
        decks[currentDeck] = true;
        return (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: "1.2rem",
                        lineHeight: "2rem",
                    }}
                >
                    Decks {currentDeck + 1}/{MAX.deckCount}
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "0.2rem",
                    }}
                >
                    {decks.map((active, index) => (
                        <img
                            key={index}
                            src={resources["Icon: DeckSelectionBall"]}
                            style={{
                                height: "1rem",
                                margin: "0 1rem",
                                opacity: active ? 1 : 0.5,
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Before any node is clicked for the first time, info is an empty object
    if (Object.keys(info).length === 0) {
        return null;
    }

    return (
        <>
            <div
                style={{
                    display: show ? "inline" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 11,
                }}
            />
            <ModalBase
                title={info.name}
                titleIcon
                titleBarHeight={"4.4rem"}
                style={{
                    display: show ? "inline" : "none",
                    position: "absolute",
                    top: "18.2rem",
                    right: "23.2rem",
                    width: "48rem",
                    zIndex: 11,
                }}
            >
                <div
                    style={{
                        width: "inherit",
                        marginLeft: "1.3rem",
                        marginRight: "1.3rem",
                        paddingBottom: "1.2rem",
                    }}
                >
                    <p
                        style={{
                            color: "#FFFFFFEE",
                            fontSize: "1.3rem",
                            lineHeight: "1.6rem",
                        }}
                    >
                        Information
                    </p>
                    <div
                        style={{
                            height: "7.92rem",
                            width: "100%",
                            border: "1px solid #FFFFFF88",
                            borderRadius: "0.4rem",
                            backgroundColor: "#00000033",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                marginLeft: "0.89rem",
                                marginTop: "1rem",
                            }}
                        >
                            <img
                                src={resources["Icon: ConfirmBattleStamina"]}
                                style={{
                                    height: "2.36rem",
                                    marginRight: "0.7rem",
                                }}
                            />
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "12.4rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "2rem",
                                }}
                            >
                                Stamina
                            </p>
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "2.1rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "1.8rem",
                                }}
                            >
                                :
                            </p>
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "12.4rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "2rem",
                                }}
                            >
                                {info.battleInfo.stamina}
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                marginLeft: "0.89rem",
                                marginTop: "1rem",
                            }}
                        >
                            <img
                                src={resources["Icon: ConfirmBattleBattles"]}
                                style={{
                                    height: "2.36rem",
                                    marginRight: "0.7rem",
                                }}
                            />
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "12.4rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "2rem",
                                }}
                            >
                                Battles
                            </p>
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "2.1rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "1.8rem",
                                }}
                            >
                                :
                            </p>
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    width: "12.4rem",
                                    fontSize: "2.2rem",
                                    lineHeight: "2rem",
                                }}
                            >
                                {info.battleInfo.battles}
                            </p>
                        </div>
                    </div>

                    <p
                        style={{
                            color: "#FFFFFFEE",
                            fontSize: "1.3rem",
                            lineHeight: "1.6rem",
                        }}
                    >
                        Bonuses
                    </p>
                    <div
                        style={{
                            height: "4.72rem",
                            width: "100%",
                            border: "1px solid #FFFFFF88",
                            borderRadius: "0.4rem",
                            backgroundColor: "#00000033",
                        }}
                    >
                        <div
                            style={{
                                height: "75%",
                                width: "98%",
                                backgroundImage: "linear-gradient(#405359, #141E20)",
                                marginRight: "auto",
                                marginLeft: "auto",
                                marginTop: "0.5rem",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "0.5rem",
                                }}
                            >
                                <img
                                    src={resources["Icon: ConfirmBattleMonster"]}
                                    style={{
                                        height: "2.36rem",
                                    }}
                                />
                                <img
                                    src={resources["Icon: Prismatic Skillseed Small"]}
                                    style={{
                                        height: "2.36rem",
                                        marginLeft: "1rem",
                                    }}
                                />
                                {/* TODO: Figure out the skillseed multipliers */}
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.5rem",
                                        lineHeight: "2rem",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    x {2.5}
                                </p>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.5rem",
                                        lineHeight: "2rem",
                                        marginLeft: "1rem",
                                    }}
                                >
                                    (+{50}%)
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: "0.5rem",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.3rem",
                                        lineHeight: "2rem",
                                        marginRight: "0.5rem",
                                    }}
                                >
                                    Difficulty
                                </p>
                                <DifficultyMeter />
                            </div>
                        </div>
                    </div>

                    <p
                        style={{
                            color: "#FFFFFFEE",
                            fontSize: "1.3rem",
                            lineHeight: "1.6rem",
                        }}
                    >
                        Warnings
                    </p>
                    <div
                        style={{
                            height: "6.25rem",
                            width: "100%",
                            border: "1px solid #FFFFFF88",
                            borderRadius: "0.4rem",
                            backgroundColor: "#00000033",
                            marginBottom: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "0.5rem",
                                marginTop: "0.2rem",
                            }}
                        >
                            <img
                                src={resources["Icon: ConfirmBattleWarning"]}
                                style={{
                                    height: "2.36rem",
                                    marginRight: "0.5rem",
                                }}
                            />
                            <Warnings warningsIndex={0} />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "0.5rem",
                                marginBottom: "0.2rem",
                            }}
                        >
                            <img
                                src={resources["Icon: ConfirmBattleWarning"]}
                                style={{
                                    height: "2.36rem",
                                    marginRight: "0.5rem",
                                }}
                            />
                            <Warnings warningsIndex={1} />
                        </div>
                    </div>

                    <p
                        style={{
                            color: "#FFFFFFEE",
                            fontSize: "1.3rem",
                            lineHeight: "1.6rem",
                        }}
                    >
                        Select Deck
                    </p>
                    <div
                        style={{
                            height: "3.75rem",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                height: "100%",
                                width: "9.8rem",
                                background: "linear-gradient(to right, #153663, #028AE0, #153663)",
                                borderRadius: "0.8rem",
                                marginRight: "0.2rem",
                            }}
                        >
                            <img
                                src={resources["Icon: ButtonBorder_Left"]}
                                style={{
                                    height: "inherit",
                                }}
                            />
                            <img
                                src={resources["Icon: ButtonBorder_Middle"]}
                                style={{
                                    height: "inherit",
                                    width: "100%",
                                }}
                            />
                            <img
                                src={resources["Icon: ButtonBorder_Right"]}
                                style={{
                                    height: "inherit",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    src={resources["Icon: CycleJob"]}
                                    style={{
                                        height: "2rem",
                                        marginRight: "0.4rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.7rem",
                                        marginTop: "-0.1rem",
                                    }}
                                >
                                    MAIN
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                height: "3.19rem",
                                width: "15.14rem",
                                border: "1px solid #FFFFFF88",
                                borderRadius: "0.4rem",
                                backgroundColor: "#00000033",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "0.1rem",
                            }}
                        >
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: "1.2rem",
                                }}
                            >
                                Elements
                            </p>
                            {getCurrentDeckElements().map((element, index) => (
                                <img
                                    key={index}
                                    src={resources[`Icon: ${capitalize(element)}OrbBordered`]}
                                    style={{
                                        height: "2.6rem",
                                        marginLeft: "0.2rem",
                                    }}
                                />
                            ))}
                        </div>
                        <div
                            style={{
                                position: "relative",
                                height: "100%",
                                width: "20rem",
                                display: "flex",
                                alignItems: "flex-end",
                                marginBottom: "0.7rem",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.2rem",
                                        lineHeight: "1.3rem",
                                        marginBottom: "0.1rem",
                                        textAlign: "left",
                                        width: "11.5rem",
                                    }}
                                >
                                    {getCurrentDeckName()}
                                </p>
                                <div style={{ border: "1px solid #FFFFFF88", width: "11.5rem" }} />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.2rem",
                                        lineHeight: "1.2rem",
                                        textAlign: "right",
                                    }}
                                >
                                    Lv.
                                </p>
                            </div>
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: "3.5rem",
                                    lineHeight: "3.5rem",
                                    fontWeight: "lighter",
                                }}
                            >
                                {getCurrentDeckLevel()}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            height: "14rem",
                            width: "100%",
                            border: "1px solid #FFFFFF88",
                            borderRadius: "0.4rem",
                            backgroundColor: "#00000033",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <DeckSelection
                            refresher={refresher}
                            deckStyle={{
                                height: "11.25rem",
                                minWidth: "44.95rem",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            height: "4rem",
                            width: "100%",
                        }}
                    >
                        <DeckSelectionBalls />
                    </div>

                    <div
                        style={{
                            height: "8.33rem",
                            width: "100%",
                            border: "1px solid #FFFFFF88",
                            borderRadius: "0.4rem",
                            backgroundColor: "#00000033",
                            marginBottom: "0.4rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                height: "45%",
                                justifyContent: "space-between",
                                margin: "0.5rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    height: "3rem",
                                    width: "47%",
                                    border: "1px solid #FFFFFF88",
                                    borderRadius: "0.4rem",
                                    backgroundColor: "#00000033",
                                }}
                            >
                                <img
                                    src={resources["Icon: Ether_Small"]}
                                    style={{
                                        height: "100%",
                                        marginLeft: "1rem",
                                        marginBottom: "0.2rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.5rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    Ether x{1648}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "3.5rem",
                                    width: "51%",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                <img
                                    src={resources["Icon: Battle_UltimateBarIcon"]}
                                    style={{
                                        height: "2.8rem",
                                        filter: "url(#ultimateBarIconFilter)",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "relative",
                                        height: "1.1rem",
                                        width: "19rem",
                                        border: "1px solid black",
                                    }}
                                >
                                    <img
                                        src={resources["Icon: Battle_UltimateBar"]}
                                        style={{
                                            height: "inherit",
                                            width: "inherit",
                                            transform: "rotate(180deg)",
                                            position: "absolute",
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: "inherit",
                                            width: `${100 - 90}%`,
                                            backgroundColor: "#5C5A5B",
                                            position: "absolute",
                                            right: 0,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "0.5rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    height: "3rem",
                                    width: "47%",
                                    border: "1px solid #FFFFFF88",
                                    borderRadius: "0.4rem",
                                    backgroundColor: "#00000033",
                                }}
                            >
                                <img
                                    src={resources["Icon: WarpShard_Small"]}
                                    style={{
                                        height: "100%",
                                        marginLeft: "1rem",
                                        marginBottom: "0.2rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.5rem",
                                        lineHeight: "2rem",
                                        opacity: 0.7,
                                    }}
                                >
                                    Warp Shard x{110}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "3.5rem",
                                    width: "51%",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                <img
                                    src={resources["Icon: PhoenixDown_Small"]}
                                    style={{
                                        height: "2.8rem",
                                        filter: "url(#ultimateBarIconFilter)",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "1.5rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    Phoenix Down x{930}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            border: "1px solid #FFFFFF88",
                            width: "100%",
                            marginBottom: "1.11rem",
                        }}
                    />
                    <ModalButton
                        title="Quickstart"
                        style={{
                            height: "5.69rem",
                            marginBottom: "1.3rem",
                            width: "100%",
                            fontSize: "2.6rem",
                        }}
                    />
                    <ModalButton
                        title="Cancel"
                        style={{
                            height: "5.69rem",
                            width: "100%",
                            fontSize: "2.6rem",
                        }}
                        onClick={handleModalClose}
                    />
                </div>
            </ModalBase>
        </>
    );
}

export default ConfirmBattleModal;
