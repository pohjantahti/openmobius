import { createContext, useState } from "react";
import { ScopedCssBaseline } from "@mui/material";
import MainMenu from "./views/MainMenu";
import StartMenu from "../replica/components/view/StartMenu";
import AssetCollections from "../asset-collections/AssetCollections";
import AssetViewer from "../asset-viewer/AssetViewer";
import Battle from "../battle/Battle";
import MainAppBar from "./MainAppBar";

type RouteOptions = "mainMenu" | "battle" | "assetCollections" | "assetViewer" | "replica";

const RouteContext = createContext<React.Dispatch<React.SetStateAction<RouteOptions>> | null>(null);

function Router() {
    const [gameAssetsProvided, setGameAssetsProvided] = useState(false);
    const [route, setRoute] = useState<RouteOptions>("mainMenu");

    const routes: Record<RouteOptions, React.ReactNode> = {
        mainMenu: (
            <MainMenu
                setRoute={setRoute}
                gameAssetsProvided={gameAssetsProvided}
                setGameAssetsProvided={setGameAssetsProvided}
            />
        ),
        battle: <Battle />,
        assetCollections: <AssetCollections setRoute={setRoute} />,
        assetViewer: <AssetViewer setRoute={setRoute} />,
        replica: <StartMenu />,
    };

    return (
        <RouteContext.Provider value={setRoute}>
            {route === "replica" ? (
                <StartMenu />
            ) : (
                <>
                    <MainAppBar gameAssetsProvided={gameAssetsProvided} />
                    <ScopedCssBaseline>{routes[route]}</ScopedCssBaseline>
                </>
            )}
        </RouteContext.Provider>
    );
}

export default Router;
export { RouteContext };
export type { RouteOptions };
