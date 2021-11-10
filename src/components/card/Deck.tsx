import BorderedArea from "./BorderedArea";
import CardThumbnail from "./CardThumbnail";
import JobThumbnail from "./JobThumbnail";

function Deck() {
    const deckInfo: { job: any; cards: Array<any> } = {
        job: {
            thumbnail: "Thumbnail: Warrior",
            class: "warrior",
            level: 12,
            overboost: 32,
        },
        cards: [
            {
                thumbnail: "Thumbnail: Ares",
                star: 5,
                class: "warrior",
                element: "fire",
                level: 80,
                overboost: 8,
            },
            {
                thumbnail: "Thumbnail: Valkyrie",
                star: 5,
                class: "ranger",
                element: "water",
                level: 80,
                overboost: 7,
            },
            {
                thumbnail: "Thumbnail: Knights of the Round: FFVII",
                star: 5,
                class: "support",
                element: "life",
                level: 56,
                overboost: 0,
            },
            {
                thumbnail: "Thumbnail: A Tale of Hope",
                star: 5,
                class: "support",
                element: "life",
                level: 80,
                overboost: 8,
            },
        ],
    };

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <BorderedArea
                style={{
                    height: "11.25rem",
                    width: "8.9rem",
                }}
                childrenStyle={{
                    padding: "0 0.2rem",
                }}
            >
                <p
                    style={{
                        color: "#FFFFFF",
                        fontSize: "1.3rem",
                        lineHeight: "2rem",
                        marginLeft: "0.3rem",
                    }}
                >
                    Job
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "0.4rem",
                    }}
                >
                    <BorderedArea
                        style={{
                            height: "8.4rem",
                            width: "8.4rem",
                        }}
                        childrenStyle={{
                            margin: "0.3rem",
                        }}
                    >
                        <JobThumbnail info={deckInfo.job} />
                    </BorderedArea>
                </div>
            </BorderedArea>
            <BorderedArea
                style={{
                    height: "11.25rem",
                    width: "35.56rem",
                    marginLeft: "0.5rem",
                }}
                childrenStyle={{
                    width: "34.56rem",
                    height: "100%",
                    padding: "0 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
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
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "0.4rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <BorderedArea
                            style={{
                                height: "8.4rem",
                                width: "8.4rem",
                            }}
                            childrenStyle={{
                                margin: "0.3rem",
                            }}
                        >
                            <CardThumbnail info={deckInfo.cards[0]} />
                        </BorderedArea>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <BorderedArea
                            style={{
                                height: "8.4rem",
                                width: "8.4rem",
                            }}
                            childrenStyle={{
                                margin: "0.3rem",
                            }}
                        >
                            <CardThumbnail info={deckInfo.cards[1]} />
                        </BorderedArea>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <BorderedArea
                            style={{
                                height: "8.4rem",
                                width: "8.4rem",
                            }}
                            childrenStyle={{
                                margin: "0.3rem",
                            }}
                        >
                            <CardThumbnail info={deckInfo.cards[2]} />
                        </BorderedArea>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <BorderedArea
                            style={{
                                height: "8.4rem",
                                width: "8.4rem",
                            }}
                            childrenStyle={{
                                margin: "0.3rem",
                            }}
                        >
                            <CardThumbnail info={deckInfo.cards[3]} />
                        </BorderedArea>
                    </div>
                </div>
            </BorderedArea>
        </div>
    );
}

export default Deck;
