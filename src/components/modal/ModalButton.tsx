import { useState } from "react";

interface Props {
    title: string;
    onClick?: () => void;
    style: {
        height: string | number;
        width: string | number;
        fontSize: string | number;
        [style: string]: string | number;
    };
    showSubDeck?: boolean;
}

function ModalButton(props: Props) {
    const [pressing, setPressing] = useState(false);
    const { showSubDeck = false } = props;

    // In arrays: [mainColor (blue), subColor (pink)]
    const color = {
        border: [
            ["#34D7E0", "#004D51"],
            ["#A169B4", "#51335F"],
        ],
        background: [
            ["#004242", "#006E6F"],
            ["#462B4F", "#5F3666"],
        ],
        pressing: ["#00B3B2EE", "#811585EE"],
    };

    return (
        <div
            style={{
                ...props.style,
                backgroundImage: `linear-gradient(174deg, ${
                    color.border[Number(showSubDeck)][0]
                } 47%, ${color.border[Number(showSubDeck)][1]} 51%)`,
                borderRadius: "0.4rem",
                padding: "0.15rem 0.1rem 0.1rem 0.1rem",
            }}
        >
            <div
                style={{
                    background: `linear-gradient(${color.background[Number(showSubDeck)][0]}, ${
                        color.background[Number(showSubDeck)][1]
                    }, ${color.background[Number(showSubDeck)][1]}, ${
                        color.background[Number(showSubDeck)][1]
                    }, ${color.background[Number(showSubDeck)][0]})`,
                    height: "inherit",
                    width: "inherit",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    borderRadius: "0.5rem",
                }}
            >
                {!pressing && (
                    <div
                        style={{
                            background: `radial-gradient(circle, ${
                                color.pressing[Number(showSubDeck)]
                            } 30%, #00000000)`,
                            position: "absolute",
                            height: "inherit",
                            width: "85%",
                        }}
                    />
                )}
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: props.style.fontSize,
                        lineHeight: "inherit",
                        zIndex: 1,
                    }}
                >
                    {props.title}
                </p>
            </div>
            {/* Clickable area */}
            <div
                style={{
                    position: "relative",
                    width: "inherit",
                    height: "inherit",
                    marginTop: "-" + props.style.height,
                    zIndex: 1,
                }}
                onMouseDown={() => setPressing(true)}
                onMouseUp={() => setPressing(false)}
                onMouseLeave={() => setPressing(false)}
                onClick={props.onClick}
            />
        </div>
    );
}

export default ModalButton;
