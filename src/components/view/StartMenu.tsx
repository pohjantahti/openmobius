import { useState } from "react";
import AspectRatioScaler from "../other/AspectRatioScaler";
import { setBaseDirectoryHandle } from "../../extractor";
import { saveResources, tilesetList, loadingResourceList, resources } from "../../extractor";

function StartMenu() {
    const [loadingCompleted, setLoadingCompleted] = useState(false);
    const [loadingInProgress, setLoadingInProgress] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState<Array<string | number>>([]);

    const handleOpenFolderButton = async () => {
        try {
            await setBaseDirectoryHandle();
            setLoadingInProgress(true);
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
            setLoadingInProgress(false);
            setLoadingCompleted(true);
        } catch (error) {
            console.error(error);
        }
    };

    const updateProgress = (name: string, left: number, total: number) => {
        setLoadingInfo([name, left, total]);
    };

    // Display general info about this project and instructions to use it
    const StartInfo = () => {
        // TODO: Add a way to preconfigure settings (volume, etc.) as Collapse element
        return (
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: 900,
                        backgroundColor: "#3D3D3D",
                        margin: "40px 10px",
                        borderRadius: 10,
                        color: "#E5E5E5",
                        fontWeight: "normal",
                        padding: "10px 15px 30px",
                    }}
                    id="startMenuContainer"
                >
                    <h1>OpenMobius</h1>

                    <a
                        style={{ color: "#0080EE" }}
                        href="https://github.com/pohjantahti/openmobius"
                    >
                        View on Github
                    </a>

                    <h2>What is it?</h2>
                    <p>
                        OpenMobius is an open-source, partial replication of the original Mobius
                        Final Fantasy game. In its current form, it's a small tech demo with some
                        interactable features.
                    </p>
                    <p>
                        <b>Disclaimer: </b>
                        This site is not an official Final Fantasy product and is not affiliated
                        with nor endorsed by Square Enix. The site does not contain any original
                        game assets and does not earn money in any way. Usage of this site's
                        features requires the original game assets.
                    </p>

                    <Collapse title="How to use it?">
                        <p>Base requirements:</p>
                        <ul>
                            <li>Original Mobius Final Fantasy game assets (GL version)</li>
                            <li>
                                Browser that supports File System Access API.
                                <a
                                    style={{ color: "#0080EE", marginLeft: 4 }}
                                    href="https://caniuse.com/native-filesystem-api"
                                >
                                    Check compatibility.
                                </a>
                            </li>
                        </ul>

                        <p>Instructions (written for Windows but applicable to any other OS)</p>
                        <ol>
                            <li>
                                Figure out the location of your game assets:
                                <ul>
                                    <li>If you know this, skip to 2.</li>
                                    <li>
                                        If you do not know, they are likely in the default Steam
                                        installation location (on Windows "C:\Program Files
                                        (x86)\Steam\steamapps\common\MOBIUS FINAL FANTASY").
                                    </li>
                                    <li>
                                        If you can't find them, searching for "mobiusff.exe" in File
                                        Explorer may help you find them.
                                    </li>
                                </ul>
                            </li>
                            <br />

                            <li>
                                Check that your game asset folder contains a folder called
                                "mobiusff_Data" and inside it are folders "mobius_data" and
                                "StreamingAssets".
                            </li>
                            <br />

                            <li>
                                Make sure that your game assets are not located in a protected
                                folder that File System Access API can't access due to security
                                reasons. If they are, copy them to a non-protected location.
                                <br />
                                <br />
                                Examples of protected folders:
                                <ul>
                                    <li>"Program Files (x86)" (the default Steam location)</li>
                                    <li>Other Windows related folders: Program Files, Windows</li>
                                    <li>Some user folders: Downloads, Documents, Desktop</li>
                                </ul>
                                Examples of non-protected locations:
                                <ul>
                                    <li>
                                        A folder in the root of your Windows drive (for example,
                                        "C:\mobiusfolder").
                                    </li>
                                    <li>A folder in another drive (A, B, D, etc.)</li>
                                    <li>Some user folders: Pictures, Music, Videos</li>
                                </ul>
                            </li>
                            <br />

                            <li>
                                Once given access, this site will retain it to go through your game
                                asset files, extracting the needed resources from them, as long as
                                this site stays open in your browser. This site only reads files and
                                will not create new or alter existing files in any way.
                            </li>
                            <br />

                            <li>Click the 'Open "mobiusff_Data" folder' button below.</li>
                            <br />

                            <li>
                                Use the window to select the "mobiusff_Data" folder and click
                                "Select folder".
                            </li>
                            <ul>
                                <li>
                                    If the folder was the correct one, asset loading will begin.
                                </li>
                                <li>
                                    If the loading does not begin, make sure you selected the
                                    correct folder and/or go back to 2.
                                </li>
                                <li>
                                    If the browser popup asks you to choose another folder, go back
                                    to 3.
                                </li>
                                <li>
                                    If clicking the button below doesn't do anything, go back to
                                    base requirements.
                                </li>
                            </ul>
                        </ol>
                    </Collapse>

                    <button onClick={handleOpenFolderButton}>Open "mobiusff_Data" folder</button>
                </div>
            </div>
        );
    };

    interface CollapseProps {
        title: string;
        children: React.ReactNode;
    }

    // Collapsible element that opens and closes when clicking the title
    const Collapse = (props: CollapseProps) => {
        const [open, setOpen] = useState(false);
        const [hovering, setHovering] = useState(false);

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    margin: "10px 0px",
                }}
            >
                <div
                    style={{
                        height: 50,
                        backgroundColor: open || hovering ? "#212121" : "#2D2D2D",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 20px 0px 10px",
                        cursor: "pointer",
                    }}
                    onClick={() => setOpen(!open)}
                    onMouseEnter={() => setHovering(!hovering)}
                    onMouseLeave={() => setHovering(!hovering)}
                >
                    <h2>{props.title}</h2>
                    <h2>{open ? "-" : "+"}</h2>
                </div>
                <div
                    style={{
                        maxHeight: open ? "100%" : 0,
                        overflow: "hidden",
                        padding: open ? 10 : 0,
                        backgroundColor: "#333333",
                    }}
                >
                    {props.children}
                </div>
            </div>
        );
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
                <>
                    <StartInfo />
                    {loadingInProgress && <LoadingModal />}
                </>
            )}
        </>
    );
}

export default StartMenu;
