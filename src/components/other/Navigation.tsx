import { baseResourceList } from "../../extractor";
import LoadingScreen from "../view/LoadingScreen";

// At the moment a barebone component since only 1 region exists

function Navigation() {
    const loadingInfo = {
        firstTime: true,
        loadingTimeLength: 10000,
        resourceLists: [baseResourceList],
    };

    return <LoadingScreen loadingInfo={loadingInfo} />;
}

export default Navigation;
