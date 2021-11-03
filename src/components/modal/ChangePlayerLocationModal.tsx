import ModalBase from "./ModalBase";
import ModalButton from "./ModalButton";

interface Props {
    show: boolean;
    info: any;
    handleChangingPlayerLocation: any;
    closeModal: any;
}

function ChangePlayerLocationModal(props: Props) {
    const { show, info, handleChangingPlayerLocation, closeModal } = props;

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
                    top: "35rem",
                    right: "23.2rem",
                    height: "40rem",
                    width: "46rem",
                    zIndex: 11,
                }}
            >
                <ModalBase title="Teleport" smallModal>
                    <div
                        style={{
                            width: "43.28rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <div
                            style={{
                                height: "19rem",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <p
                                style={{
                                    // TODO: Add correct color and textShadow color
                                    color: "#FFFFFFEE",
                                    fontSize: "2.5rem",
                                    lineHeight: "3rem",
                                    textAlign: "center",
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
                            style={{ marginBottom: "1.39rem" }}
                            onClick={() => handleChangingPlayerLocation("confirmLocation", info.id)}
                        />
                        <ModalButton title="Cancel" onClick={closeModal} />
                    </div>
                </ModalBase>
            </div>
        </>
    );
}

export default ChangePlayerLocationModal;
