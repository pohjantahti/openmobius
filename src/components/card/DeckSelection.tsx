import React, { useState } from "react";
import { currentDeck, deckInfo, MAX, setCurrentDeck } from "../../info";
import DeckDisplay from "./DeckDisplay";

interface Props {
    refresher: React.Dispatch<React.SetStateAction<number>>;
    deckStyle: React.CSSProperties;
    showSubDeck: boolean;
}

function DeckSelection(props: Props) {
    const { refresher, deckStyle, showSubDeck } = props;
    const [position, setPosition] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);

    const handleMouseDown = (event: React.MouseEvent) => {
        setMouseDown(!mouseDown);
        setPosition(event.clientX);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (mouseDown) {
            const positionDelta = position - event.clientX;
            if (positionDelta > 20) {
                setCurrentDeck(changeCurrentDeck("right"));
            } else if (positionDelta < -20) {
                setCurrentDeck(changeCurrentDeck("left"));
            }
        }
    };

    const changeCurrentDeck = (direction: "left" | "right"): number => {
        let newCurrentDeck: number;
        if (direction === "left") {
            newCurrentDeck = Math.max(currentDeck - 1, 0);
        } else {
            newCurrentDeck = Math.min(currentDeck + 1, MAX.deckCount - 1);
        }
        setMouseDown(false);
        refresher(Math.random());
        return newCurrentDeck;
    };

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
            }}
        >
            <div
                onMouseDown={handleMouseDown}
                onMouseUp={() => setMouseDown(false)}
                onMouseLeave={() => setMouseDown(false)}
                onMouseMove={handleMouseMove}
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    transition: "left 0.3s",
                    left: `-${currentDeck * 100}%`,
                }}
            >
                {deckInfo.map((fullDeck, index) => (
                    <DeckDisplay
                        key={index}
                        style={{ ...deckStyle, margin: "0 0.5%" }}
                        deck={fullDeck[Number(showSubDeck)]}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckSelection;
