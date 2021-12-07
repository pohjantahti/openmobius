import { resources } from "../../extractor";
import { currentDeck, MAX } from "../../info";

function DeckSelectionBalls() {
    const decks: Array<boolean> = Array(MAX.deckCount).fill(false);
    decks[currentDeck] = true;

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <p
                style={{
                    color: "#FFFFFF",
                    fontSize: "1.2rem",
                    lineHeight: "2rem",
                }}
            >
                Decks {currentDeck + 1}/{MAX.deckCount}
            </p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0.2rem",
                }}
            >
                {decks.map((active, index) => (
                    <img
                        key={index}
                        src={resources["Icon: DeckSelectionBall"]}
                        style={{
                            height: "1rem",
                            margin: "0 1rem",
                            opacity: active ? 1 : 0.5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckSelectionBalls;
