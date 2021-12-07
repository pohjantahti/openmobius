import React, { useState, useEffect, useRef } from "react";
import PlayerInfo from "../drawer/PlayerInfo";
import ConfirmBattleModal from "../modal/ConfirmBattleModal";
import { getGameData, getResourceURL, resources } from "../../extractor";
import MapNodes from "../map/MapNodes";
import MapButtons from "../map/MapButtons";
import ChangePlayerLocationModal from "../modal/ChangePlayerLocationModal";
import { MapNodeType, Region } from "../../data/game/regions";
import { Enemy } from "../../data/game/enemies";
import { currentDeck, deckInfo } from "../../info";

interface Props {
    setBattleInProgress: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleNodeInfo: React.Dispatch<
        React.SetStateAction<{
            enemies: Array<Array<Enemy>>;
            difficulty: number;
            battleResources: Record<string, string>;
        }>
    >;
    showButtons: boolean;
    setShowButtons: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegionMap(props: Props) {
    const { setBattleInProgress, setBattleNodeInfo, showButtons, setShowButtons } = props;
    const baseMapPosition = 0;
    const [mouseClickCount, setMouseClickCount] = useState(0);
    const [baseMousePosition, setBaseMousePosition] = useState(baseMapPosition);
    const [currentMapPosition, setCurrentMapPosition] = useState(baseMapPosition);
    const [previousMapPosition, setPreviousMapPosition] = useState(baseMapPosition);

    const [mapNodeInfo, setMapNodeInfo] = useState<Array<MapNodeType>>([]);

    const [showBattleConfirmModal, setShowBattleConfirmModal] = useState(false);
    const [selectedMapNode, setSelectedMapNode] = useState<MapNodeType>(Object());

    const [playerLocation, setPlayerLocation] = useState(0);
    const [changingPlayerLocation, setChangingPlayerLocation] = useState(false);
    const [showChangePlayerLocationConfirmModal, setShowChangePlayerLocationConfirmModal] =
        useState(false);
    const [selectedLocationInfo, setSelectedLocationInfo] = useState({});

    const mapDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            // TODO: Move this to LoadingScreen
            const mapInfo: Region = await getGameData("Region: Tower");
            // TODO: Validate mapInfo. Check for mandatory values and that id values are unique
            window.playMusic(mapInfo.music);
            setMapNodeInfo(mapInfo.nodes);
            setPlayerLocation(mapInfo.startingLocation || 0);
        };
        initMap();
    }, []);

    const handleMouseDown = (event: React.MouseEvent) => {
        setMouseClickCount(event.detail);
        setBaseMousePosition(event.clientY);
    };

    const handleMouseUp = () => {
        setMouseClickCount(0);
        setPreviousMapPosition(currentMapPosition);
    };

    // Used to calculate the backgroundPosition when it's moved
    const handleMouseMove = (event: React.MouseEvent) => {
        if (mapDiv.current && mouseClickCount === 1) {
            // Calculate the next attempted move
            let newMapPosition: number = event.clientY - baseMousePosition + previousMapPosition;
            // Check if attempted move is allowed and prevent the image from being dragged outside its area
            const imageWidth = mapDiv.current.scrollWidth;
            if (newMapPosition > 0) {
                // Too down
                newMapPosition = 0;
            } else if (Math.abs(newMapPosition) + mapDiv.current.scrollHeight > imageWidth) {
                // Too up
                newMapPosition = mapDiv.current.scrollHeight - imageWidth;
            }
            setCurrentMapPosition(newMapPosition);
        }
    };

    const handleMapNodeClick = (mapNodeId: number) => {
        const currentMapNode = mapNodeInfo.filter(
            (node: MapNodeType) => playerLocation === node.id
        )[0];
        const targetMapNode = mapNodeInfo.filter((node: MapNodeType) => mapNodeId === node.id)[0];
        // Determine if targetMapNode is the current player location or next to it
        // Searches through paths of both points to see if they are connected
        let moveAllowed = false;
        if (currentMapNode.id === targetMapNode.id) {
            moveAllowed = true;
        } else {
            currentMapNode.mapInfo.paths?.forEach((path) => {
                if (path.to === targetMapNode.id) {
                    moveAllowed = true;
                }
            });
            targetMapNode.mapInfo.paths?.forEach((path) => {
                if (path.to === currentMapNode.id) {
                    moveAllowed = true;
                }
            });
        }

        if (moveAllowed) {
            setSelectedMapNode(targetMapNode);
            setShowBattleConfirmModal(true);
            setShowButtons(false);
        }
    };

    const handleModalClose = () => {
        setShowBattleConfirmModal(false);
        setShowChangePlayerLocationConfirmModal(false);
        setShowButtons(true);
    };

    // Handles everything related to changing player location
    const handleChangingPlayerLocation = (
        action: "switchMode" | "newLocation" | "confirmLocation",
        mapNodeId?: number
    ) => {
        switch (action) {
            // Enable/disable ability to choose new location
            case "switchMode":
                setChangingPlayerLocation(!changingPlayerLocation);
                break;
            // Show confirmation modal for new location
            case "newLocation":
                const targetMapNode = mapNodeInfo.filter(
                    (node: MapNodeType) => mapNodeId === node.id
                )[0];
                setSelectedLocationInfo({
                    id: targetMapNode.id,
                    name: targetMapNode.name,
                });
                setShowChangePlayerLocationConfirmModal(true);
                setShowButtons(false);
                break;
            // Move to new location after confirm
            case "confirmLocation":
                setPlayerLocation(mapNodeId!);
                setChangingPlayerLocation(false);
                handleModalClose();
                break;
        }
    };

    const handleBattleStart = async () => {
        setShowBattleConfirmModal(false);
        // Fetch enemy data with id values from selectedMapNode and put them in enemyInfo
        const mapNodeEnemies = selectedMapNode.battleInfo.enemies!;
        const enemyInfo: Array<Array<Enemy>> = [];
        // Loop waves
        for (let i = 0; i < mapNodeEnemies.length; i++) {
            enemyInfo.push([]);
            // Loop enemies in a wave
            for (let j = 0; j < mapNodeEnemies[i].length; j++) {
                const enemy: Enemy = await getGameData("Enemy", mapNodeEnemies[i][j]);
                enemyInfo[i].push(enemy);
            }
        }

        // Find all the Job and Enemy resources
        let resourceList: Array<string> = [];
        // Job
        for (const deck of deckInfo[currentDeck]) {
            resourceList.push(deck.job.resources.card);
        }
        // Enemies
        for (const wave of enemyInfo) {
            for (const enemy of wave) {
                resourceList.push(...Object.values(enemy.resources));
            }
        }
        // Clean list of duplicates
        resourceList = Array.from(new Set(resourceList));
        // Get the resource URLs
        const battleResources: Record<string, string> = {};
        for (const resource of resourceList) {
            battleResources[resource] = await getResourceURL(resource);
        }

        setBattleNodeInfo({
            enemies: enemyInfo,
            difficulty: selectedMapNode.battleInfo.enemyDifficulty,
            battleResources: battleResources,
        });
        setBattleInProgress(true);
        setShowButtons(true);
    };

    return (
        <div
            style={{
                backgroundColor: "#000000",
                height: "100%",
                width: "100%",
            }}
        >
            <PlayerInfo
                style={{
                    position: "absolute",
                    right: "5.33rem",
                    top: "0.5rem",
                }}
                regionMap
            />
            <div
                ref={mapDiv}
                onMouseDown={(e) => handleMouseDown(e)}
                onMouseUp={() => handleMouseUp()}
                onMouseMove={(e) => handleMouseMove(e)}
                style={{
                    backgroundImage: `url("${resources["Regionmap: Tower"]}")`,
                    backgroundSize: "100%",
                    backgroundPositionY: currentMapPosition,
                    height: "100%",
                    width: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "black",
                }}
            >
                <MapNodes
                    currentMapPosition={currentMapPosition}
                    nodeInfo={mapNodeInfo}
                    handleModal={handleMapNodeClick}
                    playerLocation={playerLocation}
                    changingPlayerLocation={changingPlayerLocation}
                    handleChangingPlayerLocation={handleChangingPlayerLocation}
                />
                {changingPlayerLocation && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                            backgroundColor: "black",
                            opacity: 0.5,
                        }}
                    />
                )}
                <MapButtons
                    changingPlayerLocation={changingPlayerLocation}
                    handleChangingPlayerLocation={handleChangingPlayerLocation}
                    showButtons={showButtons}
                />
            </div>
            <ConfirmBattleModal
                show={showBattleConfirmModal}
                info={selectedMapNode}
                handleBattleStart={handleBattleStart}
                handleModalClose={handleModalClose}
            />
            <ChangePlayerLocationModal
                show={showChangePlayerLocationConfirmModal}
                info={selectedLocationInfo}
                handleChangingPlayerLocation={handleChangingPlayerLocation}
                handleModalClose={handleModalClose}
            />
        </div>
    );
}

export default RegionMap;
