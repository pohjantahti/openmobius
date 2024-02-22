import { resources } from "../../../extractor";

interface Props {
    hp: {
        main: {
            current: number;
            max: number;
        };
        sub?: {
            current: number;
            max: number;
        };
    };
}

function HPBar(props: Props) {
    const { hp } = props;
    return (
        <>
            {/* HP bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: "8rem",
                    right: "17.5rem",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <p style={{ fontFamily: "CinemaFont", fontSize: "2.2rem", marginRight: "0.7rem" }}>
                    HP
                </p>
                <div
                    style={{
                        display: "flex",
                        marginTop: "0.3rem",
                    }}
                >
                    <img
                        alt=""
                        src={resources["Icon: Battle_HPBarBackground_Left"]}
                        style={{
                            height: "2rem",
                        }}
                    />
                    <img
                        alt=""
                        src={resources["Icon: Battle_HPBarBackground_Middle"]}
                        style={{
                            height: "2rem",
                            width: "23.3rem",
                        }}
                    />
                    <img
                        alt=""
                        src={resources["Icon: Battle_HPBarBackground_Right"]}
                        style={{
                            height: "2rem",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            height: "1.2rem",
                            width: "23rem",
                            border: "1px solid black",
                            marginLeft: "0.45rem",
                            marginTop: "0.3rem",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                background: "linear-gradient(#01F700, #006801)",
                                position: "absolute",
                            }}
                        />
                        <div
                            style={{
                                height: "100%",
                                width: `${100 - (hp.main.current / hp.main.max) * 100}%`,
                                backgroundColor: "black",
                                position: "absolute",
                                right: 0,
                                transition: "width 0.5s linear",
                            }}
                        />
                    </div>
                    {/* Second HP bar when main and sub jobs are different */}
                    {hp.sub && (
                        <div
                            style={{
                                position: "absolute",
                                height: "0.6rem",
                                width: "23rem",
                                border: "1px solid black",
                                marginLeft: "0.45rem",
                                marginTop: "1.2rem",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    background: "linear-gradient(#01F700, #006801)",
                                    position: "absolute",
                                }}
                            />
                            <div
                                style={{
                                    height: "100%",
                                    width: `${100 - (hp.sub.current / hp.sub.max) * 100}%`,
                                    backgroundColor: "black",
                                    position: "absolute",
                                    right: 0,
                                    transition: "width 0.5s linear",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* HP text */}
            <div
                style={{
                    position: "absolute",
                    width: "25rem",
                    bottom: "9.7rem",
                    right: "18rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: "2.1rem",
                        filter: "url(#blackOutlineFilter)",
                    }}
                >
                    {hp.main.current}
                </p>
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: "1.5rem",
                        marginTop: "0.7rem",
                        marginLeft: "0.6rem",
                        filter: "url(#blackOutlineFilter)",
                    }}
                >
                    /{hp.main.max}
                </p>
            </div>
        </>
    );
}

export default HPBar;
