import { BattleAction } from "../../../battle/types";
import { resources } from "../../../extractor";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number) => void;
    changingTarget: boolean;
}
function ClickButtons(props: Props) {
    const { handleBattleAction, changingTarget } = props;
    return (
        <>
            {/* Tap attack button */}
            <div
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                }}
                onClick={() => handleBattleAction(BattleAction.Tap)}
            />

            {/* Help button */}
            <div
                style={{
                    position: "absolute",
                    top: "1.11rem",
                    right: "0.1rem",
                }}
                onClick={() => handleBattleAction(BattleAction.Help)}
            >
                <img
                    alt=""
                    src={resources["Icon: Battle_ButtonBackground_Left"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <img
                    alt=""
                    src={resources["Icon: Battle_ButtonBackground_Middle"]}
                    style={{
                        height: "3.5rem",
                        width: "7.5rem",
                    }}
                />
                <img
                    alt=""
                    src={resources["Icon: Battle_ButtonBackground_Right"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <p
                    style={{
                        position: "absolute",
                        top: "0.4rem",
                        color: "#FFFFFF",
                        fontSize: "1.3rem",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    HELP
                </p>
            </div>

            {/* Target button */}
            <div
                style={{
                    position: "absolute",
                    bottom: "2.5rem",
                    right: "29.5rem",
                }}
                onClick={() => handleBattleAction(BattleAction.TargetView)}
            >
                <img
                    src={resources["Icon: Battle_ButtonBackground_Left"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <img
                    src={resources["Icon: Battle_ButtonBackground_Middle"]}
                    style={{
                        height: "3.5rem",
                        width: "7.5rem",
                    }}
                />
                <img
                    src={resources["Icon: Battle_ButtonBackground_Right"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <p
                    style={{
                        position: "absolute",
                        top: "0.6rem",
                        color: changingTarget ? "#FF0000" : "#FFFFFF",
                        fontSize: "1.1rem",
                        width: "100%",
                        textAlign: "center",
                        lineHeight: "1.2rem",
                    }}
                >
                    TARGET
                    <br />
                    VIEW
                </p>
            </div>

            {/* Auto button */}
            <div
                style={{
                    position: "absolute",
                    bottom: "2.5rem",
                    right: "17.5rem",
                }}
                onClick={() => handleBattleAction(BattleAction.Auto)}
            >
                <img
                    src={resources["Icon: Battle_ButtonBackground_Left"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <img
                    src={resources["Icon: Battle_ButtonBackground_Middle"]}
                    style={{
                        height: "3.5rem",
                        width: "7.5rem",
                    }}
                />
                <img
                    src={resources["Icon: Battle_ButtonBackground_Right"]}
                    style={{
                        height: "3.5rem",
                    }}
                />
                <img
                    src={resources["Icon: CardThumbnail_Decoration3*"]}
                    style={{
                        height: "2.8rem",
                        width: "9.2rem",
                        marginTop: "0.4rem",
                        marginLeft: "0.2rem",
                        position: "absolute",
                        left: 0,
                    }}
                />
                <img
                    src={resources["Icon: Drawer_BackgroundIcon"]}
                    style={{
                        height: "2.8rem",
                        width: "5rem",
                        marginTop: "0.4rem",
                        marginLeft: "2.3rem",
                        position: "absolute",
                        left: 0,
                        opacity: 0.5,
                    }}
                />
                <p
                    style={{
                        position: "absolute",
                        top: "0.4rem",
                        color: "#FFFFFF",
                        fontSize: "1.2rem",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    AUTO
                </p>
            </div>
        </>
    );
}

export default ClickButtons;
