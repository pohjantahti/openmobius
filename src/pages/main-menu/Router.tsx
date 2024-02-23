import { useState } from "react";
import StartInfo from "./views/StartInfo";
import MainMenu from "./views/MainMenu";
import StartMenu from "../replica/components/view/StartMenu";
import AssetViewer from "./views/AssetViewer";

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
                routes[route]
            ) : (
                <StartInfo setStartInfoComplete={setStartMenuComplete} />
            )}
        </>
    );
}

export default Router;
export type { RouteOptions };
