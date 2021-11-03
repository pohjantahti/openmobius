import { useEffect, useState } from "react";
import { resources } from "../../extractor";
import { emptyDistiller, playerInfo } from "../../playerInfo";

interface Props {
    style?: React.CSSProperties;
    regionMap?: boolean;
}

function PlayerInfo(props: Props) {
    const { style, regionMap } = props;

    const [staminaTime, setStaminaTime] = useState("00:00");
    const [magiciteTime, setMagiciteTime] = useState("00:00:00");

    useEffect(() => {
        const interval = setInterval(() => {
            setStaminaTime(playerInfo.stamina.timeLeft.current.string);
            setMagiciteTime(playerInfo.distiller.timeLeft.current.string);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [regionMap]);

    return (
        <div
            style={{
                ...style,
                height: "6.67rem",
                width: "44.45rem",
                display: "flex",
                marginLeft: "0.6rem",
            }}
        >
            {/* Single/multiplayer icon displayed in RegionMap version */}
            {regionMap && (
                <img
                    src={resources["Icon: Singleplayer"]}
                    style={{
                        position: "absolute",
                        height: "3.5rem",
                        top: "1rem",
                        left: "-4rem",
                    }}
                />
            )}
            {/* Player name, level and stamina bar */}
            <div>
                {/* Player name and level */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "24.2rem",
                        marginBottom: "-0.6rem",
                        marginLeft: "0.12rem",
                    }}
                >
                    <p
                        style={{
                            fontSize: "1.5rem",
                            color: "#F6FBFF",
                            textShadow:
                                "-1px 0 #659DB8, 0 1px #659DB8, 1px 0 #659DB8, 0 -1px #659DB8",
                        }}
                    >
                        {playerInfo.name}
                    </p>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            color: "#FFFEF5",
                            textShadow:
                                "-1px 0 #A9A777, 0 1px #A9A777, 1px 0 #A9A777, 0 -1px #A9A777",
                        }}
                    >
                        {`Lv.${playerInfo.level}`}
                    </p>
                </div>
                {/* Stamina bar */}
                <div
                    style={{
                        height: "1.11rem",
                        width: "25.5rem",
                        border: "1px solid #FFFFFFDD",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            backgroundImage: "linear-gradient(to right, #064161, #50FD8A)",
                        }}
                    />
                    <div
                        style={{
                            backgroundColor: "black",
                            width: `${
                                (1 -
                                    Math.min(
                                        playerInfo.stamina.current / playerInfo.stamina.max,
                                        1
                                    )) *
                                100
                            }%`,
                            height: "100%",
                            right: 0,
                            position: "absolute",
                            opacity: 0.8,
                            transition: "width 0.8s",
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        marginLeft: "6rem",
                    }}
                >
                    <p
                        style={{
                            fontSize: "1.3rem",
                            marginTop: "-0.7rem",
                            color: "#D2FEFD",
                            textShadow:
                                "-1px 0 #67AB7A, 0 1px #67AB7A, 1px 0 #67AB7A, 0 -1px #67AB7A",
                        }}
                    >
                        {playerInfo.stamina.current > playerInfo.stamina.max
                            ? `${playerInfo.stamina.max}(+${
                                  playerInfo.stamina.current - playerInfo.stamina.max
                              })/${playerInfo.stamina.max}`
                            : `${playerInfo.stamina.current}/${playerInfo.stamina.max}`}
                    </p>
                    {playerInfo.stamina.current < playerInfo.stamina.max && (
                        <p
                            style={{
                                fontSize: "1.2rem",
                                marginLeft: "6rem",
                                marginTop: "-0.2rem",
                                color: "#FFFFFF",
                                textShadow:
                                    "-1px 0 #92A79E, 0 1px #92A79E, 1px 0 #92A79E, 0 -1px #92A79E",
                                textAlign: "right",
                                lineHeight: "1.4rem",
                            }}
                        >
                            Recovery
                            <br />
                            {staminaTime}
                        </p>
                    )}
                </div>
            </div>
            {/* Gil, magicite and magicite distiller */}
            <div>
                <div>
                    <div style={{ display: "flex" }}>
                        <img
                            src={resources["Icon: Gil"]}
                            style={{
                                height: "2.22rem",
                                marginTop: "0.5rem",
                                marginLeft: "-1.2rem",
                            }}
                        />
                        <div
                            style={{
                                width: "14.2rem",
                                textAlign: "end",
                                marginTop: "0.6rem",
                                marginLeft: "1rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "1.3rem",
                                    color: "#FFFFFF",
                                    textShadow:
                                        "-1px 0 #92A79E, 0 1px #92A79E, 1px 0 #92A79E, 0 -1px #92A79E",
                                    lineHeight: "1.4rem",
                                }}
                            >
                                {playerInfo.gil.toLocaleString("en")}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid #FFFFFFDD",
                            width: "15.6rem",
                            height: 0,
                            marginTop: "-0.6rem",
                            marginLeft: "0.89rem",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            height: "0.3rem",
                            width: "0.3rem",
                            backgroundColor: "#FFFFFF",
                            right: regionMap ? "2rem" : "4.8rem",
                            top: "2rem",
                            borderRadius: "0.2rem",
                        }}
                    />
                </div>
                <div>
                    <div
                        style={{
                            display: "flex",
                            width: "14rem",
                            textAlign: "end",
                        }}
                    >
                        <img
                            src={resources["Icon: Magicite"]}
                            style={{
                                height: "2.22rem",
                                marginTop: "0.4rem",
                            }}
                        />
                        <div
                            style={{
                                width: "14rem",
                                textAlign: "end",
                                marginTop: "0.6rem",
                                marginLeft: "10.6rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "1.3rem",
                                    color: "#FFFFFF",
                                    textShadow:
                                        "-1px 0 #92A79E, 0 1px #92A79E, 1px 0 #92A79E, 0 -1px #92A79E",
                                    lineHeight: "1.4rem",
                                }}
                            >
                                {playerInfo.magicite.toLocaleString("en")}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid #FFFFFFDD",
                            width: "15.6rem",
                            height: 0,
                            marginTop: "-0.5rem",
                            marginLeft: "2.1rem",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            height: "0.3rem",
                            width: "0.3rem",
                            backgroundColor: "#FFFFFF",
                            right: regionMap ? "1rem" : "3.7rem",
                            top: "4.2rem",
                            borderRadius: "0.2rem",
                        }}
                    />
                </div>
                {/* Magicite distiller */}
                {regionMap && (
                    <>
                        {/* Magicite distiller bar */}
                        <div
                            style={{
                                position: "relative",
                                height: "1.11rem",
                                width: "15rem",
                                border: "1px solid #FFFFFFDD",
                                top: -1,
                                left: "2.1rem",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    backgroundImage: "linear-gradient(to right, #1E9091, #96C9FF)",
                                }}
                            />
                            <div
                                style={{
                                    backgroundColor: "black",
                                    width: `${
                                        (1 -
                                            playerInfo.distiller.current /
                                                playerInfo.distiller.max) *
                                        100
                                    }%`,
                                    height: "100%",
                                    right: 0,
                                    position: "absolute",
                                    opacity: 0.6,
                                    transition: "width 0.8s",
                                }}
                            />
                        </div>
                        {/* Magicite count displayer */}
                        <div
                            style={{
                                position: "absolute",
                                right: `${
                                    14.8 -
                                    (playerInfo.distiller.current / playerInfo.distiller.max) * 15
                                }rem`, // Ranges from 14.8 (left) to -0.2 (right)
                                bottom: "-3rem",
                                width: "9.2rem",
                                height: "4rem",
                                transition: "right 0.8s",
                                zIndex: 1,
                            }}
                            onClick={() => emptyDistiller()}
                        >
                            <p
                                style={{
                                    position: "absolute",
                                    top:
                                        playerInfo.distiller.current === playerInfo.distiller.max
                                            ? "1.3rem"
                                            : "0.5rem",
                                    right: "3.3rem",
                                    fontSize: "1.1rem",
                                    color: "#FFFFFF",
                                    textShadow:
                                        "-1px 0 #92A79E, 0 1px #92A79E, 1px 0 #92A79E, 0 -1px #92A79E",
                                    lineHeight: "1.4rem",
                                    textAlign: "right",
                                }}
                            >
                                {playerInfo.distiller.current === playerInfo.distiller.max ? (
                                    "Full"
                                ) : (
                                    <>
                                        To Full:
                                        <br />
                                        {magiciteTime}
                                    </>
                                )}
                            </p>
                            <img
                                src={resources["Icon: MagiciteDistiller"]}
                                style={{
                                    position: "absolute",
                                    height: "3.2rem",
                                    top: "0.4rem",
                                    right: 0,
                                }}
                            />
                            <img
                                src={resources["Icon: MagiciteDistillerArrow"]}
                                style={{
                                    position: "absolute",
                                    right: "0.9rem",
                                    height: "0.7rem",
                                    width: "1.4rem",
                                    filter: "url(#distillerArrowFilter)",
                                    transform: "rotate(180deg) rotateY(180deg)",
                                }}
                            />
                            <p
                                style={{
                                    position: "absolute",
                                    top: "1.4rem",
                                    right: 0,
                                    textAlign: "center",
                                    width: "3.2rem",
                                    height: "1.6rem",
                                    fontSize: "1.1rem",
                                    color: "#FFFFFF",
                                    textShadow:
                                        "-1px 0 #92A79E, 0 1px #92A79E, 1px 0 #92A79E, 0 -1px #92A79E",
                                    lineHeight: "1.4rem",
                                }}
                            >
                                {playerInfo.distiller.current}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PlayerInfo;
