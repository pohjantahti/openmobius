import ModalBase from "./ModalBase";
import ModalButton from "./ModalButton";
import { resources } from "../../extractor";

interface Props {
    show: boolean;
    info: {
        name: string;
        stamina: number;
        battles: number;
    };
    closeModal: any;
}

function ConfirmBattleModal(props: Props) {
    const { show, info, closeModal } = props;

    return (
        <>
            <div
                style={{
                    display: show ? "inline" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 11,
                }}
            />
            <div
                style={{
                    display: show ? "inline" : "none",
                    position: "absolute",
                    top: "18.34rem",
                    right: "23.2rem",
                    height: "78.06rem",
                    width: "48rem",
                    zIndex: 11,
                }}
            >
                <ModalBase title={info.name} innerIcon>
                    <div
                        style={{
                            width: "45.28rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <p
                            style={{
                                color: "#FFFFFFEE",
                                fontSize: "1.3rem",
                                lineHeight: "1.6rem",
                            }}
                        >
                            Information
                        </p>
                        <div
                            style={{
                                height: "7.92rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    marginLeft: "0.89rem",
                                    marginTop: "1rem",
                                }}
                            >
                                <img
                                    src={resources["Icon: ConfirmBattleStamina"]}
                                    style={{
                                        height: "2.36rem",
                                        marginRight: "0.7rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "12.4rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    Stamina
                                </p>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "2.1rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "1.8rem",
                                    }}
                                >
                                    :
                                </p>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "12.4rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    {info.stamina}
                                </p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    marginLeft: "0.89rem",
                                    marginTop: "1rem",
                                }}
                            >
                                <img
                                    src={resources["Icon: ConfirmBattleBattles"]}
                                    style={{
                                        height: "2.36rem",
                                        marginRight: "0.7rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "12.4rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    Battles
                                </p>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "2.1rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "1.8rem",
                                    }}
                                >
                                    :
                                </p>
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        width: "12.4rem",
                                        fontSize: "2.2rem",
                                        lineHeight: "2rem",
                                    }}
                                >
                                    {info.battles}
                                </p>
                            </div>
                        </div>

                        <p
                            style={{
                                color: "#FFFFFFEE",
                                fontSize: "1.3rem",
                                lineHeight: "1.6rem",
                            }}
                        >
                            Bonuses
                        </p>
                        <div
                            style={{
                                height: "4.72rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                            }}
                        ></div>

                        <p
                            style={{
                                color: "#FFFFFFEE",
                                fontSize: "1.3rem",
                                lineHeight: "1.6rem",
                            }}
                        >
                            Warnings
                        </p>
                        <div
                            style={{
                                height: "6.25rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                                marginBottom: "1.5rem",
                            }}
                        ></div>

                        <p
                            style={{
                                color: "#FFFFFFEE",
                                fontSize: "1.3rem",
                                lineHeight: "1.6rem",
                            }}
                        >
                            Select Deck
                        </p>
                        <div
                            style={{
                                height: "3.75rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                            }}
                        ></div>
                        <div
                            style={{
                                height: "18.05rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                            }}
                        ></div>

                        <div
                            style={{
                                height: "8.33rem",
                                width: "100%",
                                border: "1px solid #FFFFFF88",
                                borderRadius: 4,
                                backgroundColor: "#00000033",
                                marginBottom: "0.4rem",
                            }}
                        ></div>

                        <div
                            style={{
                                border: "1px solid #FFFFFF88",
                                width: "100%",
                                marginBottom: "1.11rem",
                            }}
                        />
                        <ModalButton title="Quickstart" style={{ marginBottom: "1.39rem" }} />
                        <ModalButton title="Cancel" onClick={closeModal} />
                    </div>
                </ModalBase>
            </div>
        </>
    );
}

export default ConfirmBattleModal;
