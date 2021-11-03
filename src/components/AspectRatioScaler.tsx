import { useState, useEffect } from "react";
import App from "./App";

// Scale the content to 16:9 aspect ratio to make it look the same on different screen sizes.
// Drawback: black backs when browser window is not in 16:9 ratio
// Benefit: width and height values need to be specified only once and work on all window sizes and ratios

// As some UI elements consist of text and sometimes multiple images of different aspect
// ratios being stacked on top of each other, not having to worry about them going
// off sync due to different window sizes is a major benefit to everyones sanity.

function AspectRatioScaler() {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    window.onresize = () => {
        handleWindowSize();
    };

    useEffect(() => {
        handleWindowSize();
    }, []);

    // Changing fontSize of <html> is used to scale the content correctly using rem for width and height values
    // To convert vh/vw to rem: change vh to rem and change vm * 1.778 to rem
    // Example: 12vh, 4vm -> 12rem, 7.1rem
    const handleWindowSize = () => {
        const root = document.getElementsByTagName("html")[0];
        const currentHeight = window.innerWidth * 0.5625;
        if (currentHeight > window.innerHeight) {
            // Left and right bars
            const newHeight = window.innerHeight;
            const newWidth = window.innerHeight / 0.5625;
            setHeight(newHeight);
            setWidth(newWidth);
            root.style.fontSize = `${(newHeight / 0.5625 + newWidth) / 350}px`;
        } else {
            // Top and bottom bars
            const newHeight = currentHeight;
            const newWidth = window.innerWidth;
            setHeight(newHeight);
            setWidth(newWidth);
            root.style.fontSize = `${(newHeight / 0.5625 + newWidth) / 350}px`;
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: width,
                    height: height,
                }}
            >
                <App />
                {/* Hide stuff outside the intended visible area. */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: "100%",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 100,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "100%",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 100,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        right: 0,
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 100,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 100,
                    }}
                />
            </div>
        </div>
    );
}

export default AspectRatioScaler;
