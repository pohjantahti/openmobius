import { resources } from "../../../extractor";

interface Props {
    ultimateGauge: {
        current: number;
        max: number;
    };
}

function UltimateBar(props: Props) {
    const { ultimateGauge } = props;

    return (
        <div
            style={{
                position: "absolute",
                bottom: "6.8rem",
                right: "17.9rem",
                display: "flex",
                alignItems: "center",
            }}
        >
            <img
                alt=""
                src={resources["Icon: Battle_UltimateBarIcon"]}
                style={{
                    height: "2.5rem",
                    filter: "url(#blackFilter)",
                    marginRight: "-0.1rem",
                }}
            />
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
                        height: "1.4rem",
                    }}
                />
                <img
                    alt=""
                    src={resources["Icon: Battle_HPBarBackground_Middle"]}
                    style={{
                        height: "1.4rem",
                        width: "18.2rem",
                    }}
                />
                <img
                    alt=""
                    src={resources["Icon: Battle_HPBarBackground_Right"]}
                    style={{
                        height: "1.4rem",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        height: "0.8rem",
                        width: "18.2rem",
                        border: "1px solid black",
                        marginLeft: "0.2rem",
                        marginTop: "0.3rem",
                    }}
                >
                    <img
                        alt=""
                        src={resources["Icon: Battle_UltimateBar"]}
                        style={{
                            height: "100%",
                            width: "100%",
                            transform: "rotate(180deg)",
                            position: "absolute",
                        }}
                    />
                    <div
                        style={{
                            height: "100%",
                            // lost ultimate %
                            width: `${100 - (ultimateGauge.current / ultimateGauge.max) * 100}%`,
                            backgroundColor: "black",
                            position: "absolute",
                            right: 0,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default UltimateBar;
