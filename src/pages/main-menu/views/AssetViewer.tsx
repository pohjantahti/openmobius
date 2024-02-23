import { RouteOptions } from "../Router";
import Box from "../components/Box";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function AssetViewer(props: Props) {
    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                justifyContent: "flex-start",
                height: "100%",
                width: "100%",
            }}
        >
            <Box
                style={{
                    height: "auto",
                    width: 400,
                    margin: "5px 2.5px 5px 5px",
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                <h1 onClick={() => props.setRoute("mainMenu")}>{"<"}</h1>
                <h1>Asset Viewer</h1>
            </Box>
            <Box
                style={{
                    height: "auto",
                    width: "100%",
                    margin: "5px 5px 5px 2.5px",
                }}
            ></Box>
        </div>
    );
}

export default AssetViewer;
