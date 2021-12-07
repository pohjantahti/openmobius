import { resources } from "../../extractor";

interface Props {
    changingPlayerLocation: boolean;
    handleChangingPlayerLocation: any;
    showButtons: boolean;
}

function MapButtons(props: Props) {
    const { changingPlayerLocation, handleChangingPlayerLocation, showButtons } = props;

    return (
        <div
            style={{
                opacity: showButtons ? 1 : 0,
                transition: "opacity 0.3s",
            }}
        >
            {/* Change location button */}
            <div
                style={{
                    position: "absolute",
                    top: "18.6rem",
                    right: "10rem",
                }}
                onClick={() => handleChangingPlayerLocation("switchMode")}
            >
                <img
                    src={resources["Icon: MapNode_Black"]}
                    style={{
                        position: "absolute",
                        height: "6.4rem",
                    }}
                />
                <img
                    src={
                        resources[
                            changingPlayerLocation
                                ? "Icon: Map_ChangingPlayerLocation"
                                : "Icon: Map_ChangePlayerLocation"
                        ]
                    }
                    style={{
                        position: "absolute",
                        top: "1.4rem",
                        left: changingPlayerLocation ? "1.6rem" : "1.2rem",
                        height: "3.6rem",
                        filter: "url(#changePlayerLocationFilter)",
                    }}
                />
            </div>
            {/* Current location button for centering the view to current location */}
            {/* TODO: Functionality to center view to current location on map */}
            <div
                style={{
                    position: "absolute",
                    top: "27rem",
                    right: "10rem",
                }}
            >
                <img
                    src={resources["Icon: Map_CurrentLocationButton"]}
                    style={{
                        position: "absolute",
                        height: "6.4rem",
                    }}
                />
            </div>
        </div>
    );
}

export default MapButtons;
