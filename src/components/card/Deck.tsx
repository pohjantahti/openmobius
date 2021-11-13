import { DeckType } from "../../info/types";
import BorderedArea from "./BorderedArea";
import CardThumbnail from "./CardThumbnail";
import JobThumbnail from "./JobThumbnail";

// In "style" prop, the ratio of height and width should roughly be: height / width = ~0.25

interface Props {
    style?: React.CSSProperties;
    deck: DeckType;
}

function Deck(props: Props) {
    return (
        <div
            style={{
                ...props.style,
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <BorderedArea
                style={{
                    height: "100%",
                    width: "20%",
                }}
                childrenStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        height: "20%",
                        width: "90%",
                        padding: "0 5%",
                    }}
                >
                    <p
                        style={{
                            color: "#FFFFFF",
                            fontSize: "1.3rem",
                            lineHeight: "2rem",
                        }}
                    >
                        Job
                    </p>
                </div>
                <div
                    style={{
                        height: "80%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <BorderedArea
                        style={{
                            height: "92%",
                            width: "92%",
                        }}
                        childrenStyle={{
                            height: "100%",
                            width: "100%",
                            margin: "4%",
                        }}
                    >
                        <JobThumbnail info={props.deck.job} />
                    </BorderedArea>
                </div>
            </BorderedArea>
            <BorderedArea
                style={{
                    height: "100%",
                    width: "79%",
                }}
                childrenStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        height: "20%",
                        width: "96%",
                        padding: "0 2%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <p
                        style={{
                            color: "#FFFFFF",
                            fontSize: "1.3rem",
                            lineHeight: "2rem",
                        }}
                    >
                        EXP x5
                    </p>
                    <p
                        style={{
                            color: "#FFFFFF",
                            fontSize: "1.3rem",
                            lineHeight: "2rem",
                        }}
                    >
                        Abilities
                    </p>
                </div>
                <div
                    style={{
                        height: "80%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    {props.deck.cards.map((card, index) => (
                        <BorderedArea
                            key={index}
                            style={{
                                height: "92%",
                                width: "23.3%",
                            }}
                            childrenStyle={{
                                height: "100%",
                                width: "100%",
                                margin: "4%",
                            }}
                        >
                            <CardThumbnail info={card} />
                        </BorderedArea>
                    ))}
                </div>
            </BorderedArea>
        </div>
    );
}

export default Deck;
