import { useState } from "react";
import { resources } from "../../extractor";
import { getCurrentDeckElements, getCurrentDeckLevel, getCurrentDeckName } from "../../info";
import { capitalize } from "@utils";
import DeckSelection from "./DeckSelection";
import DeckSelectionBalls from "./DeckSelectionBalls";

interface Props {
    showSubDeck: boolean;
    setShowSubDeck: React.Dispatch<React.SetStateAction<boolean>>;
}

function ConfirmBattleSelectDeck(props: Props) {
    const { showSubDeck, setShowSubDeck } = props;
    // Used to force DeckSelectionBalls to re-render. Called in DeckSelection.
    const [, refresher] = useState(0);

    // In arrays: [mainColor (blue), subColor (pink)]
    const color = {
        jobChange: [
            ["#153663", "#028AE0"],
            ["#A15EB2", "#831D88"],
        ],
        area: ["#00000033", "#794C92"],
    };

    return (
        <>
            {/* Top row:
            Button to switch between main and sub job.
            Display job elements, name and deck level. */}
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
                        background: `linear-gradient(to right, ${
                            color.jobChange[Number(showSubDeck)][0]
                        }, ${color.jobChange[Number(showSubDeck)][1]}, ${
                            color.jobChange[Number(showSubDeck)][0]
                        })`,
                        borderRadius: "0.8rem",
                        marginRight: "0.2rem",
                    }}
                    onClick={() => setShowSubDeck(!showSubDeck)}
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
                            alignItems: "center",
                            marginLeft: "1rem",
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
                            {showSubDeck ? "SUB" : "MAIN"}
                        </p>
                    </div>
                </div>
                <div
                    style={{
                        height: "3.19rem",
                        width: "15.1rem",
                        border: "1px solid #FFFFFF88",
                        borderRadius: "0.4rem",
                        backgroundColor: color.area[Number(showSubDeck)],
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
                    {getCurrentDeckElements(showSubDeck).map((element, index) => (
                        <img
                            key={index}
                            src={resources[`Icon: ${capitalize(element)}Orb_Bordered`]}
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
                            {getCurrentDeckName(showSubDeck)}
                        </p>
                        <div
                            style={{
                                border: "1px solid #FFFFFF88",
                                width: "11.5rem",
                            }}
                        />
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
                        {getCurrentDeckLevel(showSubDeck)}
                    </p>
                </div>
            </div>
            {/* Middle row: Switch between different decks */}
            <div
                style={{
                    height: "14rem",
                    width: "100%",
                    border: "1px solid #FFFFFF88",
                    borderRadius: "0.4rem",
                    backgroundColor: color.area[Number(showSubDeck)],
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
                    showSubDeck={showSubDeck}
                />
            </div>
            {/* Bottom row: Display index of currently seen deck */}
            <div
                style={{
                    height: "4rem",
                    width: "100%",
                }}
            >
                <DeckSelectionBalls />
            </div>
        </>
    );
}

export default ConfirmBattleSelectDeck;
