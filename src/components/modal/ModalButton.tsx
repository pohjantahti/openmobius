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
}

function ModalButton(props: Props) {
    const [pressing, setPressing] = useState(false);

    return (
        <div
            style={{
                ...props.style,
                backgroundImage: "linear-gradient(174deg, #34D7E0 47%, #004D51 51%)",
                borderRadius: "0.4rem",
                padding: "0.15rem 0.1rem 0.1rem 0.1rem",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(#004242, #006E6F, #006E6F, #006E6F, #004242)",
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
                            background: "radial-gradient(circle, #00B3B2EE 30%, #00000000)",
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
