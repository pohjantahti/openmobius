import { Typography } from "@mui/material";
import Texture2D from "./assetTypes/Texture2D";
import Mesh from "./assetTypes/Mesh";
import { DisplayedAsset } from "../AssetViewer";

interface Props {
    displayedAsset: DisplayedAsset | undefined;
}

interface AssetTypeProps {
    url: string;
    classId: number;
}

function AssetDisplay(props: Props) {
    const { displayedAsset } = props;

    const AssetType = (props: AssetTypeProps) => {
        const { url, classId } = props;

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

    return (
        <>
            {displayedAsset && (
                <AssetType url={displayedAsset.url} classId={displayedAsset.classId} />
            )}
        </>
    );
}

export default AssetDisplay;
