import React from "react";
import { MapNodeType } from "../../data/game/regions";
import MapNode from "./MapNode";
import MapPaths from "./MapPaths";

interface Props {
    currentMapPosition: number;
    nodeInfo: Array<MapNodeType> | undefined;
    handleModal: (mapNodeId: number) => void;
    playerLocation: number;
    changingPlayerLocation: boolean;
    handleChangingPlayerLocation: (
        action: "switchMode" | "newLocation" | "confirmLocation",
        mapNodeId?: number
    ) => void;
}

function MapNodes(props: Props) {
    const {
        currentMapPosition,
        nodeInfo,
        handleModal,
        playerLocation,
        changingPlayerLocation,
        handleChangingPlayerLocation,
    } = props;

    return !nodeInfo ? null : (
        <div
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: currentMapPosition,
                left: 0,
            }}
        >
            {nodeInfo.map((node, index) => (
                <React.Fragment key={index}>
                    <MapNode
                        key={index}
                        info={node}
                        handleModal={handleModal}
                        playerLocation={playerLocation === node.id ? true : false}
                        changingPlayerLocation={changingPlayerLocation}
                        handleChangingPlayerLocation={handleChangingPlayerLocation}
                    />
                    {node.mapInfo.paths && <MapPaths node={node} nodeInfo={nodeInfo} />}
                </React.Fragment>
            ))}
        </div>
    );
}

export default MapNodes;
