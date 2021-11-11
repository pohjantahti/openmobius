import { playerInfo } from "../../info";
import SkillseedInfo from "./SkillseedInfo";

function CardsInfo() {
    return (
        <>
            <div
                style={{
                    height: "33.47rem",
                    width: "41.68rem",
                }}
            >
                {/* Player level info */}
                <div style={{ marginBottom: "0.3rem" }}>
                    <div>
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.4rem",
                                margin: "-1rem 0 -0.4rem",
                            }}
                        >
                            Player
                        </p>
                    </div>
                    <div
                        style={{
                            height: "3.45rem",
                            width: "40.96rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #FFFFFFAA",
                            backgroundColor: "#00000033",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0.3rem 0.53rem 0 0.35rem",
                        }}
                    >
                        <div
                            style={{
                                height: "0.9rem",
                                width: "100%",
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
                                        (playerInfo.exp.current / playerInfo.exp.max) * 100
                                    }%`,
                                    height: "100%",
                                    right: 0,
                                    position: "absolute",
                                    opacity: 0.8,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                height: "2rem",
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#FFFEF5",
                                        textShadow:
                                            "-1px 0 #A9A777, 0 1px #A9A777, 1px 0 #A9A777, 0 -1px #A9A777",
                                        lineHeight: "2.2rem",
                                        marginTop: "-0.3rem",
                                        marginRight: "1.8rem",
                                    }}
                                >
                                    Lv.
                                </p>
                                <p
                                    style={{
                                        fontSize: "1.9rem",
                                        color: "#FFFEF5",
                                        textShadow:
                                            "-1px 0 #A9A777, 0 1px #A9A777, 1px 0 #A9A777, 0 -1px #A9A777",
                                        lineHeight: "2.2rem",
                                    }}
                                >
                                    221
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#FFFEF5",
                                        textShadow:
                                            "-1px 0 #A9A777, 0 1px #A9A777, 1px 0 #A9A777, 0 -1px #A9A777",
                                        lineHeight: "2.2rem",
                                        marginTop: "-0.3rem",
                                        marginRight: "0.5rem",
                                    }}
                                >
                                    To next level:
                                </p>
                                <p
                                    style={{
                                        fontSize: "1.9rem",
                                        color: "#FFFEF5",
                                        textShadow:
                                            "-1px 0 #A9A777, 0 1px #A9A777, 1px 0 #A9A777, 0 -1px #A9A777",
                                        lineHeight: "2.2rem",
                                    }}
                                >
                                    {playerInfo.exp.max - playerInfo.exp.current}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Current deck and skillseed info */}
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.4rem",
                                margin: "0 0 -0.4rem",
                            }}
                        >
                            Current Deck
                        </p>
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.4rem",
                                margin: "0 0 -0.4rem",
                            }}
                        >
                            Warrior Lv.320
                        </p>
                    </div>
                    <div
                        style={{
                            height: "25rem",
                            width: "41.67rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #FFFFFFAA",
                            backgroundColor: "#00000033",
                        }}
                    >
                        {/* Current deck info */}
                        <div
                            style={{
                                height: "12.5rem",
                                width: "41.67rem",
                            }}
                        >
                            {/* TODO: Current deck info here */}
                        </div>
                        {/* Skillseed info */}
                        <div
                            style={{
                                height: "12.5rem",
                                width: "41.67rem",
                            }}
                        >
                            <p
                                style={{
                                    color: "#FFFFFFDD",
                                    fontSize: "1.4rem",
                                    margin: "0 0.71rem -0.3rem",
                                }}
                            >
                                Skillseeds
                            </p>
                            <div
                                style={{
                                    border: "1px solid #FFFFFFDD",
                                    width: "40.79rem",
                                    marginLeft: "0.3rem",
                                }}
                            />
                            <SkillseedInfo />
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    height: "3.34rem",
                    width: "41.67rem",
                }}
            />
        </>
    );
}

export default CardsInfo;
