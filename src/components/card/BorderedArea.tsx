import { resources } from "../../extractor";

interface Props {
    style: React.CSSProperties;
    childrenStyle?: React.CSSProperties;
    children?: React.ReactNode;
}

function BorderedArea(props: Props) {
    return (
        <div
            style={{
                ...props.style,
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    height: "7.5%",
                }}
            >
                <img
                    src={resources["Icon: DeckBackground_TopLeft"]}
                    style={{
                        height: "100%",
                    }}
                />
                <img
                    src={resources["Icon: DeckBackground_TopMiddle"]}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                />
                <img
                    src={resources["Icon: DeckBackground_TopRight"]}
                    style={{
                        height: "100%",
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    height: "85%",
                    justifyContent: "space-between",
                }}
            >
                <img
                    src={resources["Icon: DeckBackground_MiddleLeft"]}
                    style={{
                        height: "100%",
                        width: "1.25rem",
                    }}
                />
                <img
                    src={resources["Icon: DeckBackground_MiddleRight"]}
                    style={{
                        height: "100%",
                        width: "1.25rem",
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    height: "7.5%",
                }}
            >
                <img
                    src={resources["Icon: DeckBackground_BottomLeft"]}
                    style={{
                        height: "100%",
                    }}
                />
                <img
                    src={resources["Icon: DeckBackground_BottomMiddle"]}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                />
                <img
                    src={resources["Icon: DeckBackground_BottomRight"]}
                    style={{
                        height: "100%",
                    }}
                />
            </div>
            <div
                style={{
                    ...props.childrenStyle,
                    position: "absolute",
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

export default BorderedArea;
