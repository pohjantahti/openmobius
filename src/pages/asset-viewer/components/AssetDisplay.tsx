import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import Texture2D from "./assetTypes/Texture2D";
import Mesh from "./assetTypes/Mesh";
import { DisplayedAsset } from "../AssetViewer";
import { ClassID } from "@extractor/consts";
import JobRenderer from "@renderer/JobRenderer";

interface Props {
    displayedAsset: DisplayedAsset | undefined;
}

interface AssetTypeProps {
    asset: DisplayedAsset;
}

function AssetDisplay(props: Props) {
    const { displayedAsset } = props;
    const div = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (div.current && window.visualViewport) {
            const newHeight =
                window.visualViewport.height - div.current.getBoundingClientRect().top;
            setHeight(newHeight);
        }
    }, []);

    const AssetType = (props: AssetTypeProps) => {
        const { asset } = props;

        switch (asset.classId) {
            case ClassID.Texture2D:
                return <Texture2D url={asset.url} />;
                break;
            case ClassID.Mesh:
                return asset.collection ? (
                    <JobRenderer jobId={asset.url} />
                ) : (
                    <Mesh url={asset.url} />
                );
                break;
            default:
                return <Typography>No assets</Typography>;
                break;
        }
    };

    return (
        <div
            ref={div}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: height,
                width: "100%",
            }}
        >
            {displayedAsset && <AssetType asset={displayedAsset} />}
        </div>
    );
}

export default AssetDisplay;
