import { RouteOptions } from "../Router";
import Box from "../components/Box";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function MainMenu(props: Props) {
    const { setRoute } = props;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}
        >
            <Box
                style={{
                    width: 900,
                    height: 200,
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <h1>OpenMobius</h1>
                <p>Choose your activity</p>
            </Box>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: 900,
                }}
            >
                <Box
                    style={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0px 10px 0px 0px",
                    }}
                >
                    <h1 onClick={() => setRoute("assetViewer")}>Asset Viewer</h1>
                </Box>
                <Box
                    style={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h1 onClick={() => setRoute("replica")}>Replica</h1>
                </Box>
            </div>
        </div>
    );
}

export default MainMenu;
