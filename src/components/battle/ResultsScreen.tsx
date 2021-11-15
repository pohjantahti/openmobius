interface Props {
    resultsInProgress: boolean;
    handleResultsEnd: () => void;
}

function ResultsScreen(props: Props) {
    const { resultsInProgress, handleResultsEnd } = props;

    return (
        <div
            style={{
                display: resultsInProgress ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
            }}
        >
            <p style={{ color: "white" }}>Results</p>
            <button onClick={handleResultsEnd}>End results</button>
        </div>
    );
}

export default ResultsScreen;
