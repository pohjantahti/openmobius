import { resources } from "../../extractor";

interface Props {
    children: any;
    title: string;
    innerIcon?: boolean;
    smallModal?: boolean;
}

function ModalBase(props: Props) {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                backgroundImage: "linear-gradient(to bottom right, #54DEFB 49%, #040E1A 51%)",
                borderRadius: 5,
                padding: "0.2rem",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    backgroundColor: "#31A9C1",
                    height: props.smallModal ? "4.43rem" : "4.23rem",
                    textAlign: "center",
                    borderRadius: "4px 4px 0 0",
                }}
            >
                <img
                    src={resources["Icon: AlertTopBackground"]}
                    style={{
                        position: "absolute",
                        height: "4.03rem",
                        opacity: 0.2,
                        left: 0,
                    }}
                />
                {props.innerIcon && (
                    <img
                        src={resources["Icon: AlertTopInner"]}
                        style={{
                            position: "absolute",
                            height: "3.5rem",
                            top: "0.4rem",
                            left: "1.15rem",
                        }}
                    />
                )}
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
            <div
                style={{
                    height: "100%",
                    borderRadius: "0 0 4px 4px",
                    background: "radial-gradient(#0CA495, #167996, #167996)",
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

export default ModalBase;
