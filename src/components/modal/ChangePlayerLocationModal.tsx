import ModalBase from "./ModalBase";
import ModalButton from "./ModalButton";

interface Props {
    show: boolean;
    info: {
        id: number;
        name: string;
    };
    handleChangingPlayerLocation: (
        action: "switchMode" | "newLocation" | "confirmLocation",
        mapNodeId?: number
    ) => void;
    handleModalClose: () => void;
}

function ChangePlayerLocationModal(props: Props) {
    const { show, info, handleChangingPlayerLocation, handleModalClose } = props;

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
            <ModalBase
                title="Teleport"
                titleBarHeight={"4.2rem"}
                style={{
                    display: show ? "inline" : "none",
                    position: "absolute",
                    top: "35rem",
                    right: "23.2rem",
                    width: "46rem",
                    zIndex: 11,
                }}
            >
                <div
                    style={{
                        width: "inherit",
                        marginLeft: "1.3rem",
                        marginRight: "1.3rem",
                        paddingBottom: "1rem",
                    }}
                >
                    <div
                        style={{
                            height: "18rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <p
                            style={{
                                // TODO: Add correct color and textShadow color
                                color: "#FFFFFFEE",
                                fontSize: "2.3rem",
                                lineHeight: "3rem",
                            }}
                        >
                            {`Teleport to ${info.name}?`}
                        </p>
                    </div>

                    <div
                        style={{
                            border: "1px solid #FFFFFF88",
                            width: "100%",
                            marginBottom: "2rem",
                        }}
                    />
                    <ModalButton
                        title="Teleport"
                        style={{
                            marginBottom: "1.39rem",
                            width: "100%",
                            height: "5.2rem",
                            fontSize: "2.4rem",
                        }}
                        onClick={() => handleChangingPlayerLocation("confirmLocation", info.id)}
                    />
                    <ModalButton
                        title="Cancel"
                        style={{
                            width: "100%",
                            height: "5.2rem",
                            fontSize: "2.4rem",
                        }}
                        onClick={handleModalClose}
                    />
                </div>
            </ModalBase>
        </>
    );
}

export default ChangePlayerLocationModal;
