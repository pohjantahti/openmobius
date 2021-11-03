import { MapNodeType } from "../../data/game/regions";
import { resources } from "../../extractor";
import { capitalize } from "../../utils";

interface Props {
    info: MapNodeType;
    handleModal: any;
    playerLocation: boolean;
    changingPlayerLocation: boolean;
    handleChangingPlayerLocation: any;
}

function MapNode(props: Props) {
    const {
        info,
        handleModal,
        playerLocation,
        changingPlayerLocation,
        handleChangingPlayerLocation,
    } = props;

    return (
        <div
            style={{
                position: "absolute",
                left: `${info.mapInfo.position[0]}rem`,
                top: `${info.mapInfo.position[1]}rem`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "12.45rem",
                textAlign: "center",
                zIndex: 1,
            }}
        >
            <img
                src={resources[`Icon: Map_Node${capitalize(info.mapInfo.color)}`]}
                style={{ height: "6rem", width: "6rem" }}
                onClick={() =>
                    changingPlayerLocation
                        ? handleChangingPlayerLocation("newLocation", info.id)
                        : handleModal(info.id)
                }
            />
            {info.mapInfo.completed && (
                <img
                    src={resources["Icon: Map_Completed"]}
                    style={{
                        height: "4rem",
                        position: "absolute",
                        top: "1rem",
                        filter: "url(#completedNodeFilter)",
                    }}
                    onClick={() =>
                        changingPlayerLocation
                            ? handleChangingPlayerLocation("newLocation", info.id)
                            : handleModal(info.id)
                    }
                />
            )}
            {playerLocation && (
                <img
                    src={resources["Icon: Map_PlayerLocation"]}
                    style={{
                        position: "absolute",
                        height: "2.5rem",
                        animation: "playerLocationMarker 1s linear infinite",
                    }}
                />
            )}
            <p
                style={{
                    color: "#FFFFFF",
                    textShadow: "-1px 0 #212121, 0 1px #212121, 1px 0 #212121, 0 -1px #212121",
                    lineHeight: "1.6rem",
                    fontSize: "1.4rem",
                    width: "11rem",
                }}
            >
                {info.name}
            </p>
        </div>
    );
}

export default MapNode;
