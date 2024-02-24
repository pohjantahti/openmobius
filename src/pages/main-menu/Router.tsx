import { useState } from "react";
import { ScopedCssBaseline } from "@mui/material";
import StartInfo from "./views/StartInfo";
import MainMenu from "./views/MainMenu";
import StartMenu from "../replica/components/view/StartMenu";
import AssetViewer from "../asset-viewer/AssetViewer";

type RouteOptions = "mainMenu" | "replica" | "assetViewer";

function Router() {
    const [startInfoComplete, setStartMenuComplete] = useState(false);
    const [route, setRoute] = useState<RouteOptions>("mainMenu");

    const routes: Record<RouteOptions, React.ReactNode> = {
        mainMenu: <MainMenu setRoute={setRoute} />,
        replica: <StartMenu />,
        assetViewer: <AssetViewer setRoute={setRoute} />,
    };

    return (
        <>
            {startInfoComplete ? (
                route === "replica" ? (
                    <StartMenu />
                ) : (
                    <ScopedCssBaseline>{routes[route]}</ScopedCssBaseline>
                )
            ) : (
                <ScopedCssBaseline>
                    <StartInfo setStartInfoComplete={setStartMenuComplete} />
                </ScopedCssBaseline>
            )}
        </>
    );
}

export default Router;
export type { RouteOptions };
