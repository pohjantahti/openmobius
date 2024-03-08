import { Typography } from "@mui/material";
import Texture2D from "./assetTypes/Texture2D";
import Mesh from "./assetTypes/Mesh";

interface Props {
    displayedAsset: {
        url: string;
        classId: number;
    };
}

function AssetDisplay(props: Props) {
    const { url, classId } = props.displayedAsset;

    const AssetType = () => {
        switch (classId) {
            case 28:
                return <Texture2D url={url} />;
                break;
            case 43:
                return <Mesh url={url} />;
                break;
            default:
                return <Typography>No assets</Typography>;
                break;
        }
    };

    return <AssetType />;
}

export default AssetDisplay;
