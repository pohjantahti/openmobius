import React, { useState } from "react";

interface Props {
    title: string;
    onClick?: any;
    style?: React.CSSProperties;
}

function ModalButton(props: Props) {
    const [pressing, setPressing] = useState(false);

    return (
        <div
            style={{
                ...props.style,
                backgroundImage: "linear-gradient(174deg, #34D7E0 47%, #004D51 51%)",
                borderRadius: 4,
                height: "5.69rem",
                width: "100%",
                padding: "0.15rem 0.1rem 0.1rem 0.1rem",
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(#004242, #006E6F, #006E6F, #006E6F, #004242)",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    borderRadius: "0.5rem",
                }}
            >
                {pressing ? null : (
                    <div
                        style={{
                            background: "radial-gradient(circle, #00B3B2 30%, #00000000)",
                            position: "absolute",
                            height: "5.69rem",
                            width: "43.6rem",
                        }}
                    />
                )}
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: "2.6rem",
                        lineHeight: "5rem",
                        zIndex: 1,
                    }}
                >
                    {props.title}
                </p>
            </div>
            {/* Clickable area */}
            <div
                style={{
                    position: "absolute",
                    height: "6rem",
                    marginTop: "-6rem",
                    width: "95%",
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
