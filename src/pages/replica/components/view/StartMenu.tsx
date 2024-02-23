import { useEffect, useRef, useState } from "react";
import AspectRatioScaler from "../other/AspectRatioScaler";
import { saveResources, tilesetList, loadingResourceList, resources } from "../../extractor";

function StartMenu() {
    const [loadingCompleted, setLoadingCompleted] = useState(false);
    const loadingInProgress = useRef(false);
    const [loadingInfo, setLoadingInfo] = useState<Array<string | number>>([]);

    useEffect(() => {
        const startLoading = async () => {
            loadingInProgress.current = true;
            await saveResources(tilesetList, "Loading icon tilesets", updateProgress);
            await saveResources(
                loadingResourceList,
                "Loading loading screen assets",
                updateProgress
            );
            // Check after first loadings that resources were extracted (and assume that the rest of the game assets exist as well)
            loadingResourceList.forEach((resource: string) => {
                if (typeof resources[resource] !== "string") {
                    throw new Error("Incomplete game assets.");
                }
            });
            // Set the extracted fonts for use
            const newStyle = document.createElement("style");
            newStyle.appendChild(
                document.createTextNode(`
                @font-face {
                    font-family: MainFont;
                    src: url("${resources["Font: Main"]}");
                }
                @font-face {
                    font-family: MainFontBold;
                    src: url("${resources["Font: MainBold"]}");
                }
                @font-face {
                    font-family: CinemaFont;
                    src: url("${resources["Font: Cinema"]}");
                }
            `)
            );
            document.head.appendChild(newStyle);
            loadingInProgress.current = false;
            setLoadingCompleted(true);
        };
        if (!loadingInProgress.current) {
            startLoading();
        }
    }, []);

    const updateProgress = (name: string, left: number, total: number) => {
        setLoadingInfo([name, left, total]);
    };

    // Display progress of asset loading
    const LoadingModal = () => {
        return (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        opacity: 0.7,
                    }}
                />
                <div
                    style={{
                        height: 200,
                        width: 300,
                        backgroundColor: "#3D3D3D",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        zIndex: 2,
                    }}
                >
                    <p
                        style={{
                            fontFamily: "Arial, sans-serif",
                            color: "#E5E5E5",
                            fontWeight: "normal",
                        }}
                    >
                        {`${loadingInfo[0] || "Loading"}: ${loadingInfo[1] || 0}/${
                            loadingInfo[2] || "?"
                        }`}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            {loadingCompleted ? (
                <AspectRatioScaler />
            ) : (
                <>{loadingInProgress.current && <LoadingModal />}</>
            )}
        </>
    );
}

export default StartMenu;
