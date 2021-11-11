import { useState, useEffect } from "react";
import MainOverlay from "../pages/MainOverlay";
import { saveResources, resources } from "../extractor";
import { sleep } from "../utils";
import { initPlayerResourceTimers } from "../info";
import { initLocalStorage } from "../info/localStorage";

interface Props {
    loadingInfo: {
        resourceLists: Array<Array<string>>;
        loadingTimeLength: number;
        firstTime?: boolean;
    };
}

function LoadingScreen(props: Props) {
    const { loadingInfo } = props;

    const [completed, setCompleted] = useState(false);
    const [firstTimeLoadCompleted, setFirstTimeLoadCompleted] = useState(false);
    const [loadingInProgress, setLoadingInProgress] = useState(false);

    useEffect(() => {
        const handleFirstTimeLoading = async () => {
            setLoadingInProgress(true);
            initPlayerResourceTimers();
            await initLocalStorage();
            const totalAnimationLength = loadingInfo.loadingTimeLength;
            const startTime: number = Date.now();
            for (const resourceList of loadingInfo.resourceLists) {
                await saveResources(resourceList, "Loading base assets");
            }
            const endTime: number = (Date.now() - startTime) / 1000;
            // Calculate the remaining time for loading screen between "totalAnimationLength" and 0
            await sleep(Math.max(totalAnimationLength - endTime, 0));
            setCompleted(true);
            setFirstTimeLoadCompleted(true);
            setLoadingInProgress(false);
        };
        if (loadingInfo.firstTime && !loadingInProgress && !firstTimeLoadCompleted) {
            handleFirstTimeLoading();
        }
        // else { TODO: Regular, non-firstTime loading screen for changing region }
    }, [loadingInfo]); // eslint-disable-line react-hooks/exhaustive-deps

    const Loading = () => {
        return (
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(#0C3553, #051829)",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {/* White SE logo screen shown on first loading */}
                {firstTimeLoadCompleted ? null : (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "black",
                                animation: "firstLoadingBG 5s",
                                opacity: 0,
                                zIndex: 2,
                            }}
                        ></div>
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                animation: "firstLoading 5s",
                                opacity: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 2,
                            }}
                        >
                            <img
                                src={resources["Icon: Loading_SELogo"]}
                                style={{ height: "3.2rem" }}
                            />
                        </div>
                    </>
                )}

                {/* Background decoration image */}
                <img
                    src={resources["Icon: Loading_Decoration"]}
                    style={{
                        position: "absolute",
                        height: "75%",
                        opacity: 0.5,
                    }}
                />
                {/* Game title in the top center */}
                <p
                    style={{
                        position: "absolute",
                        color: "#FFFFFF",
                        fontSize: "2.2rem",
                        letterSpacing: "0.4rem",
                        background: "-webkit-linear-gradient(#C6F3FF, #97CCEC)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    MOBIUS FINAL FANTASY
                </p>

                {/* Blinkin loading text and spinning loading wheel */}
                <div
                    style={{
                        position: "absolute",
                        top: "80%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={resources["Icon: DrawerBackgroundGradient"]}
                        style={{
                            position: "absolute",
                            top: "-2.6rem",
                            height: "11rem",
                            width: "55rem",
                            opacity: 0.3,
                        }}
                    />
                    <img
                        src={resources["Icon: Loading_Wheel"]}
                        style={{
                            position: "absolute",
                            top: "-1rem",
                            height: "8rem",
                            animation: "spinForwardTo360 1s linear infinite",
                            opacity: 0.7,
                        }}
                    />
                    <img
                        src={resources["Icon: Loading_Wheel"]}
                        style={{
                            position: "absolute",
                            top: "-1rem",
                            height: "8rem",
                            transform: "rotate(-180deg)",
                            animation: "spinForwardTo180 1s linear infinite",
                            opacity: 0.7,
                        }}
                    />
                    <p
                        style={{
                            fontFamily: "CinemaFont",
                            fontSize: "2.6rem",
                            letterSpacing: "0.4rem",
                            background: "-webkit-linear-gradient(#C6F3FF, #97CCEC)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            opacity: 0,
                            animation: "blinkingOpacity 3s infinite",
                        }}
                    >
                        Loading...
                    </p>
                </div>

                {/* Customer ID in the bottom center */}
                <p
                    style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        left: "35%",
                        fontSize: "1.7rem",
                        background: "-webkit-linear-gradient(#C6F3FF, #97CCEC)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Customer ID : 1234 – 1234 – 1234
                </p>

                {/* Support "link" in the bottom right */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2rem",
                        right: "6rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img src={resources["Icon: ETC_Support"]} style={{ height: "5rem" }} />
                    <p
                        style={{
                            position: "absolute",
                            fontSize: "1.2rem",
                            bottom: "-1rem",
                            color: "#FFFFFF",
                        }}
                    >
                        Support
                    </p>
                </div>
            </div>
        );
    };

    return <>{completed ? <MainOverlay /> : <Loading />}</>;
}

export default LoadingScreen;
