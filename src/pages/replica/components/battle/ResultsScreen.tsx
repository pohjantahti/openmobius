import { useEffect, useState } from "react";
import { resources } from "../../extractor";
import { sleep } from "@utils";
import PlayerInfo from "../drawer/PlayerInfo";

interface Props {
    handleResultsEnd: () => void;
    info: {
        score: number;
        seedBonus: number;
        bestScore: number;
    };
}

function ResultsScreen(props: Props) {
    const { handleResultsEnd, info } = props;

    const [showTitle, setShowTitle] = useState(false);
    const [showTopInfo, setShowTopInfo] = useState(false);
    const [showBackground, setShowBackground] = useState(true);
    const [showSkipButton, setShowSkipButton] = useState(false);

    useEffect(() => {
        const handleStart = async () => {
            await sleep(100);
            setShowTitle(true);
            setShowTopInfo(true);
            setShowBackground(true);
            setShowSkipButton(true);
        };
        handleStart();
    }, []);

    const handleCloseResults = async () => {
        setShowTopInfo(false);
        await sleep(150);
        setShowTitle(false);
        await sleep(150);
        setShowBackground(false);
        await sleep(200);
        handleResultsEnd();
    };

    const handleSkip = async () => {
        setShowSkipButton(false);
        await sleep(150);
        handleCloseResults();
    };

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                opacity: showBackground ? 1 : 0,
                transition: "opacity 0.2s linear",
            }}
            onClick={handleCloseResults}
        >
            <PlayerInfo
                style={{
                    position: "absolute",
                    right: "5.33rem",
                    top: "0.5rem",
                }}
                regionMap
            />
            {/* Background dimmer */}
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    backgroundColor: "black",
                    opacity: 0.4,
                    zIndex: -1,
                }}
            />
            {/* Result content */}
            <div
                style={{
                    height: "100%",
                    width: "115rem",
                    backgroundColor: "black",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: "94.5rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <img
                        src={resources["Icon: BattleResult_Background"]}
                        style={{
                            marginTop: "2rem",
                            height: "29rem",
                            width: "29rem",
                            filter: "url(#resultTitleLineFilter)",
                            opacity: 0.5,
                            position: "absolute",
                        }}
                    />
                    <p
                        style={{
                            fontSize: "3.5rem",
                            color: "#E5FFFF",
                            textShadow:
                                "-1px 0 #42697A, 0 1px #42697A, 1px 0 #42697A, 0 -1px #42697A",
                            marginTop: "14.3rem",
                            marginRight: showTitle ? 0 : "42.5rem",
                            opacity: showTitle ? 1 : 0,
                            lineHeight: "3.5rem",
                            transition: "margin-right 0.3s linear, opacity 0.3s linear",
                        }}
                    >
                        Battle Results
                    </p>
                    <img
                        src={resources["Icon: GradientLine"]}
                        style={{
                            marginTop: "0.3rem",
                            width: "50%",
                            height: "0.3rem",
                            filter: "url(#resultTitleLineFilter)",
                        }}
                    />
                    <img
                        src={resources["Icon: GradientLine"]}
                        style={{
                            marginTop: "6.5rem",
                            width: "100%",
                            height: "0.1rem",
                            filter: "url(#resultLineFilter)",
                        }}
                    />
                    <img
                        src={resources["Icon: GradientLine"]}
                        style={{
                            marginTop: "4rem",
                            width: "100%",
                            height: "0.1rem",
                            filter: "url(#resultLineFilter)",
                        }}
                    />
                    <img
                        src={resources["Icon: GradientLine"]}
                        style={{
                            marginTop: "6.4rem",
                            width: "100%",
                            height: "0.1rem",
                            filter: "url(#resultLineFilter)",
                        }}
                    />
                    {/* Left side labels */}
                    <div
                        style={{
                            position: "absolute",
                            opacity: showTopInfo ? 1 : 0,
                            left: showTopInfo ? 0 : "-42.5rem",
                            top: "22.3rem",
                            width: "42.5rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            transition: "left 0.2s linear, opacity 0.2s linear",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "1.7rem",
                                color: "#E5FFFF",
                                textShadow:
                                    "-1px 0 #42697A, 0 1px #42697A, 1px 0 #42697A, 0 -1px #42697A",
                                lineHeight: "1.7rem",
                                marginRight: "0.4rem",
                            }}
                        >
                            Battle Score
                        </p>
                        <img
                            src={resources["Icon: GradientLine_Half"]}
                            style={{
                                width: "100%",
                                height: "0.1rem",
                                filter: "url(#resultLineFilter)",
                                transform: "rotate(180deg)",
                                marginTop: "0.2rem",
                            }}
                        />
                        <p
                            style={{
                                fontSize: "1.7rem",
                                color: "#FFFFCD",
                                textShadow:
                                    "-1px 0 #928527, 0 1px #928527, 1px 0 #928527, 0 -1px #928527",
                                lineHeight: "1.7rem",
                                marginTop: "1rem",
                                marginRight: "1.2rem",
                            }}
                        >
                            Your Score
                        </p>
                        <p
                            style={{
                                fontSize: "1.5rem",
                                color: "#FFFFFF",
                                lineHeight: "1.5rem",
                                marginTop: "2.5rem",
                                marginRight: "2.4rem",
                            }}
                        >
                            Best Score
                        </p>
                    </div>

                    {/* Right side labels */}
                    <div
                        style={{
                            position: "absolute",
                            opacity: showTopInfo ? 1 : 0,
                            left: showTopInfo ? "45.5rem" : "88rem",
                            top: "26rem",
                            width: "42.5rem",
                            display: "flex",
                            transition: "left 0.2s linear, opacity 0.2s linear",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: "15rem",
                                alignItems: "flex-end",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "2.2rem",
                                    color: "#FFFFCD",
                                    textShadow:
                                        "-1px 0 #928527, 0 1px #928527, 1px 0 #928527, 0 -1px #928527",
                                    lineHeight: "2.2rem",
                                }}
                            >
                                {info.score}
                            </p>
                            <p
                                style={{
                                    fontSize: "1.8rem",
                                    color: "#FFFFFF",
                                    lineHeight: "1.8rem",
                                    marginTop: "1.2rem",
                                }}
                            >
                                {info.bestScore}
                            </p>
                        </div>
                        <p
                            style={{
                                fontSize: "1.1rem",
                                width: "9rem",
                                color: "#FFFFCD",
                                textShadow:
                                    "-1px 0 #928527, 0 1px #928527, 1px 0 #928527, 0 -1px #928527",
                                lineHeight: "1.3rem",
                                textAlign: "center",
                                marginTop: "-0.5rem",
                            }}
                        >
                            Seed Bonus x{info.seedBonus}
                        </p>
                    </div>
                </div>
            </div>
            {/* Gradient background right of result content */}
            <div
                style={{
                    height: "100%",
                    width: "5rem",
                    background: "linear-gradient(to right, black, #00000000)",
                    opacity: 1,
                }}
            />
            {/* Skip button */}
            <div
                className="drawerButton"
                style={{
                    width: "3.3rem",
                    height: "14.6rem",
                    top: "29rem",
                    backgroundColor: "#808080",
                    right: showSkipButton ? 0 : "-4rem",
                    transition: "right 0.2s linear",
                }}
                onClick={handleSkip}
            >
                <img
                    src={resources["Icon: Drawer_HomeButton"]}
                    style={{
                        position: "absolute",
                        height: "8.3rem",
                        width: "4rem",
                        opacity: 0.4,
                        bottom: "0.2rem",
                    }}
                />
                <p
                    className="drawerButtonText"
                    style={{
                        marginTop: "4.3rem",
                        marginLeft: "1rem",
                        color: "#F0E7FC",
                    }}
                >
                    Skip
                </p>
            </div>
        </div>
    );
}

export default ResultsScreen;
