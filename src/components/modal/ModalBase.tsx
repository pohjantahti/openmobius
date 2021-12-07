import { resources } from "../../extractor";

interface Props {
    children: React.ReactNode;
    title?: string;
    titleIcon?: boolean;
    titleBarHeight: string;
    titleBarButtons?: React.ReactNode;
    style?: React.CSSProperties;
    showSub?: boolean;
}

// TODO: Add a way to set custom backgroundColors

function ModalBase(props: Props) {
    const { showSub = false } = props;

    // In arrays: [mainColor (blue), subColor (pink)]
    const color = {
        border: [
            ["#54DEFB", "#040E1A"],
            ["#DAB3E7", "#221F2D"],
        ],
        title: ["#31A9C1", "#B891C3"],
        background: [
            ["#0CA495", "#167996"],
            ["#8C7DC0", "#7C6EA3"],
        ],
    };

    return (
        <div
            style={{
                ...props.style,
                backgroundImage: `linear-gradient(to bottom right, ${
                    color.border[Number(showSub)][0]
                } 49%, ${color.border[Number(showSub)][1]} 51%)`,
                borderRadius: "0.5rem",
                padding: "0.2rem",
            }}
        >
            {/* Title bar */}
            <div
                style={{
                    backgroundColor: color.title[Number(showSub)],
                    height: props.titleBarHeight,
                    width: "inherit",
                    borderRadius: "0.4rem 0.4rem 0 0",
                }}
            >
                {/* Background images and optional button on the right side */}
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        height: "inherit",
                        width: "inherit",
                        justifyContent: "space-between",
                    }}
                >
                    <img
                        src={resources["Icon: ModalTitleBackground"]}
                        style={{
                            height: "inherit",
                            opacity: 0.2,
                        }}
                    />
                    {props.titleIcon && (
                        <img
                            src={resources["Icon: ModalTitleIcon"]}
                            style={{
                                position: "absolute",
                                height: "3.5rem",
                                top: "0.4rem",
                                left: "1.4rem",
                            }}
                        />
                    )}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "0.5rem",
                        }}
                    >
                        {props.titleBarButtons}
                    </div>
                </div>
                {/* Title bar title */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "inherit",
                        height: "inherit",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            color: "#FFFFFF",
                            fontSize: "3.4rem",
                            lineHeight: "3.4rem",
                            fontWeight: "normal",
                        }}
                    >
                        {props.title}
                    </p>
                </div>
            </div>
            {/* Content */}
            <div
                style={{
                    borderRadius: "0 0 0.4rem 0.4rem",
                    background: `radial-gradient(${color.background[Number(showSub)][0]}, ${
                        color.background[Number(showSub)][1]
                    }, ${color.background[Number(showSub)][1]})`,
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

export default ModalBase;
