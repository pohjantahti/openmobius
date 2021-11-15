interface Props {
    score: number;
    wave: {
        current: number;
        max: number;
    };
}

function ScoreWaveBar(props: Props) {
    const { score, wave } = props;

    return (
        <>
            {/* Score */}
            <div
                style={{
                    position: "absolute",
                    top: "2.6rem",
                    left: "2rem",
                    display: "flex",
                }}
            >
                <p
                    style={{
                        fontSize: "1.2rem",
                        color: "#000000",
                        filter: "url(#whiteOutlineFilter)",
                        marginRight: "1rem",
                    }}
                >
                    SCORE
                </p>
                <p
                    style={{
                        fontSize: "1.9rem",
                        color: "#000000",
                        filter: "url(#whiteOutlineFilter)",
                        lineHeight: "1.4rem",
                    }}
                >
                    {score}
                </p>
            </div>

            {/* Battles/Waves */}
            <div
                style={{
                    position: "absolute",
                    top: "2.6rem",
                    left: "26.3rem",
                    display: "flex",
                }}
            >
                <p
                    style={{
                        fontSize: "1.2rem",
                        color: "#000000",
                        filter: "url(#whiteOutlineFilter)",
                        marginRight: "0.5vw",
                    }}
                >
                    BATTLE
                </p>
                <p
                    style={{
                        fontSize: "1.9rem",
                        color: "#000000",
                        filter: "url(#whiteOutlineFilter)",
                        lineHeight: "1.4rem",
                    }}
                >
                    {wave.current + 1}/{wave.max}
                </p>
            </div>
        </>
    );
}

export default ScoreWaveBar;
