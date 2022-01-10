import React, { useState } from "react";
import { BattleAction } from "../../../battle/types";
import { resources } from "../../../extractor";
import { Element, FullElement } from "../../../info/types";
import { capitalize } from "../../../utils";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number) => void;
    elements: [Element, Element, Element];
    orbs: Record<FullElement, number>;
    ultimate: {
        gauge: {
            current: number;
            max: number;
        };
        name: string;
    };
    countdownToJobChange: number;
}

function DragButtons(props: Props) {
    const { elements, orbs, ultimate, handleBattleAction, countdownToJobChange } = props;

    const [showDriveUltimate, setShowDriveUltimate] = useState(false);
    const [driveHovered, setDriveHovered] = useState([false, false, false, false]);
    const [ultimateHovered, setUltimateHovered] = useState(false);
    const [showJobChange, setShowJobChange] = useState(false);
    const [jobChangeHovered, setJobChangeHovered] = useState(false);

    const handleDragAction = (action: string, index?: number) => {
        switch (action) {
            case "driveUltimateDown":
                setShowDriveUltimate(true);
                break;
            case "driveUltimateLeave":
                setShowDriveUltimate(false);
                setDriveHovered([false, false, false, false]);
                setUltimateHovered(false);
                break;
            case "drive":
                setShowDriveUltimate(false);
                setDriveHovered([false, false, false, false]);
                setUltimateHovered(false);
                handleBattleAction(BattleAction.Drive, index);
                break;
            case "ultimate":
                setUltimateHovered(false);
                handleBattleAction(BattleAction.Ultimate);
                break;
            case "jobChangeDown":
                setShowJobChange(true);
                break;
            case "jobChangeLeave":
                setShowJobChange(false);
                setJobChangeHovered(false);
                break;
            case "jobChange":
                handleBattleAction(BattleAction.JobChange);
                break;
            default:
                console.log("Unknown dragButton action: ", action, index);
                break;
        }
    };

    const handleDriveElementHover = (index?: number) => {
        const newHovers = [false, false, false, false];
        if (index !== undefined) {
            newHovers[index] = true;
        }
        setDriveHovered(newHovers);
    };

    const handleUltimateHover = () => {
        setUltimateHovered(!ultimateHovered);
    };

    const handleJobChangeHover = () => {
        setJobChangeHovered(!jobChangeHovered);
    };

    // In arrays: [valueNormally, valueWhenHovered]
    const hoverStyles = {
        driveHeight: ["13rem", "18rem"],
        orbHeight: ["4.9rem", "6.8rem"],
        drives: [
            {
                bottom: ["7.7rem", "6rem"],
                right: ["16rem", "16.7rem"],
                rotation: "-65",
                orb: {
                    bottom: ["12.7rem", "12.9rem"],
                    right: ["19.3rem", "21.4rem"],
                },
            },
            {
                bottom: ["12.5rem", "11.7rem"],
                right: ["12.9rem", "12.9rem"],
                rotation: "-38",
                orb: {
                    bottom: ["18.3rem", "19.6rem"],
                    right: ["15.6rem", "16.7rem"],
                },
            },
            {
                bottom: ["15.1rem", "14.6rem"],
                right: ["7.7rem", "6.7rem"],
                rotation: "-13",
                orb: {
                    bottom: ["21.1rem", "23.1rem"],
                    right: ["9.5rem", "9.2rem"],
                },
            },
            {
                bottom: ["14.8rem", "14.3rem"],
                right: ["1.4rem", "-0.7rem"],
                rotation: "15",
                orb: {
                    bottom: ["20.7rem", "22.5rem"],
                    right: ["2.3rem", "0.6rem"],
                },
            },
        ],
        ultimate: {
            height: ["9rem", "10rem"],
            bottom: ["1.2rem", "0.2rem"],
            right: ["13.4rem", "13.4rem"],
            text: {
                bottom: ["4.2rem", "3.8rem"],
                right: ["27rem", "28.4rem"],
            },
        },
        jobChange: {
            fontSize: ["2rem", "2.4rem"],
            bottom: ["19.3rem", "19rem"],
            left: ["15.4rem", "13.7rem"],
        },
    };

    const driveElements = [
        {
            element: elements[0],
            isPresent: orbs[elements[0]] && orbs[elements[0]] + orbs["prismatic"] > 0,
        },
        {
            element: elements[1],
            isPresent: orbs[elements[1]] && orbs[elements[1]] + orbs["prismatic"] > 0,
        },
        {
            element: elements[2],
            isPresent: orbs[elements[2]] && orbs[elements[2]] + orbs["prismatic"] > 0,
        },
        {
            element: "life",
            isPresent: orbs["life"] && orbs["life"] + orbs["prismatic"] > 0,
        },
    ];

    return (
        <>
            {/* Drive & Ultimate buttons */}
            <div
                style={{
                    position: "absolute",
                    bottom: "4rem",
                    right: "2.6rem",
                    width: "12.4rem",
                    height: "12rem",
                    zIndex: 1,
                }}
                onMouseDown={() => handleDragAction("driveUltimateDown")}
            />

            {showDriveUltimate && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "53.3rem",
                        height: "30rem",
                        zIndex: 3,
                    }}
                    onMouseLeave={() => handleDragAction("driveUltimateLeave")}
                    onMouseUp={() => handleDragAction("driveUltimateLeave")}
                >
                    {hoverStyles.drives.map((drive, index: number) => (
                        <React.Fragment key={index}>
                            <img
                                src={resources["Icon: Battle_DriveOrbSelectionBackground"]}
                                style={{
                                    position: "absolute",
                                    height: hoverStyles.driveHeight[Number(driveHovered[index])],
                                    bottom: drive.bottom[Number(driveHovered[index])],
                                    right: drive.right[Number(driveHovered[index])],
                                    transform: `rotate(${drive.rotation}deg)`,
                                    transition: "all 0.1s",
                                }}
                                onMouseUp={
                                    driveElements[index].isPresent
                                        ? () => handleDragAction("drive", index)
                                        : () => {}
                                }
                                onMouseEnter={
                                    driveElements[index].isPresent
                                        ? () => handleDriveElementHover(index)
                                        : () => {}
                                }
                                onMouseLeave={() => handleDriveElementHover()}
                            />
                            <img
                                src={
                                    resources[
                                        `Icon: ${capitalize(driveElements[index].element)}Orb`
                                    ]
                                }
                                style={{
                                    position: "absolute",
                                    height: hoverStyles.orbHeight[Number(driveHovered[index])],
                                    bottom: drive.orb.bottom[Number(driveHovered[index])],
                                    right: drive.orb.right[Number(driveHovered[index])],
                                    transform: `rotate(${drive.rotation}deg)`,
                                    opacity: driveElements[index].isPresent ? 1 : 0.4,
                                    transition: "all 0.1s",
                                }}
                                onMouseUp={
                                    driveElements[index].isPresent
                                        ? () => handleDragAction("drive", index)
                                        : () => {}
                                }
                                onMouseEnter={
                                    driveElements[index].isPresent
                                        ? () => handleDriveElementHover(index)
                                        : () => {}
                                }
                                onMouseLeave={() => handleDriveElementHover()}
                            />
                        </React.Fragment>
                    ))}
                    {ultimate.gauge.current === ultimate.gauge.max && (
                        <>
                            <img
                                src={resources["Icon: Battle_UltimateSelectionBackground"]}
                                style={{
                                    position: "absolute",
                                    height: hoverStyles.ultimate.height[Number(ultimateHovered)],
                                    bottom: hoverStyles.ultimate.bottom[Number(ultimateHovered)],
                                    right: hoverStyles.ultimate.right[Number(ultimateHovered)],
                                    transition: "height 0.3s, bottom 0.3s",
                                }}
                            />
                            {/* TODO: Add a blinking animation to text when hovered */}
                            <p
                                style={{
                                    position: "absolute",
                                    color: "#FFFFFF",
                                    fontSize: "2rem",
                                    bottom: hoverStyles.ultimate.text.bottom[
                                        Number(ultimateHovered)
                                    ],
                                    right: hoverStyles.ultimate.text.right[Number(ultimateHovered)],
                                    filter: "url(#blackOutlineFilter)",
                                    transition: "right 0.3s, bottom 0.3s",
                                }}
                            >
                                {ultimate.name}
                            </p>
                            <div
                                style={{
                                    position: "absolute",
                                    height: "10rem",
                                    width: "35.5rem",
                                    bottom: "0.8rem",
                                    right: "12rem",
                                }}
                                onMouseUp={() => handleDragAction("ultimate")}
                                onMouseEnter={() => handleUltimateHover()}
                                onMouseLeave={() => handleUltimateHover()}
                            />
                        </>
                    )}
                </div>
            )}

            {/* Job change button */}
            <div
                style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: 0,
                    width: "7vw",
                    height: "12rem",
                    zIndex: 1,
                }}
                onMouseDown={
                    countdownToJobChange === 0 ? () => handleDragAction("jobChangeDown") : () => {}
                }
            />

            {showJobChange && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "44.5rem",
                        height: "25rem",
                        zIndex: 3,
                        opacity: 1,
                    }}
                    onMouseLeave={() => handleDragAction("jobChangeLeave")}
                    onMouseUp={() => handleDragAction("jobChangeLeave")}
                >
                    <div
                        style={{
                            position: "absolute",
                            height: "7rem",
                            width: "33rem",
                            bottom: "17.5rem",
                            left: "8rem",
                        }}
                        onMouseUp={() => handleDragAction("jobChange")}
                        onMouseEnter={() => handleJobChangeHover()}
                        onMouseLeave={() => handleJobChangeHover()}
                    />
                </div>
            )}

            {showJobChange && (
                <>
                    <img
                        src={resources["Icon: Battle_JobChangeSelectionBackground"]}
                        style={{
                            position: "absolute",
                            height: "11rem",
                            bottom: "15rem",
                            left: "5.6rem",
                        }}
                    />
                    <img
                        src={resources["Icon: Battle_JobChangeSelectionSpike"]}
                        style={{
                            position: "absolute",
                            height: "10rem",
                            bottom: "11.5rem",
                            left: "6rem",
                        }}
                    />
                    {/* TODO: Add blinking animation to text */}
                    <p
                        style={{
                            position: "absolute",
                            color: "#FFFFFF",
                            fontSize: hoverStyles.jobChange.fontSize[Number(jobChangeHovered)],
                            bottom: hoverStyles.jobChange.bottom[Number(jobChangeHovered)],
                            left: hoverStyles.jobChange.left[Number(jobChangeHovered)],
                            filter: "url(#blackOutlineFilter)",
                            transition: "font-size 0.1s, left 0.1s, bottom 0.1s",
                        }}
                    >
                        Member Change
                    </p>
                </>
            )}
        </>
    );
}

export default DragButtons;
