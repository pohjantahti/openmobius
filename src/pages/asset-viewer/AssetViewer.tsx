import { useEffect, useRef, useState } from "react";
import { RouteOptions } from "../main-menu/Router";
import Box from "../main-menu/components/Box";
import { getHashFileList } from "@extractor/fileSystemAccess";
import { FixedSizeList } from "react-window";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function AssetViewer(props: Props) {
    const [hashFileList, setHashFileList] = useState<Array<string>>([]);
    const inProgress = useRef(false);

    useEffect(() => {
        const fetchHashFileList = async () => {
            inProgress.current = true;
            const list = await getHashFileList();
            console.log("Hash file list fetched");
            setHashFileList(list);
        };
        if (!inProgress.current) {
            fetchHashFileList();
        }
    }, []);

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
                    flexDirection: "column",
                    padding: 5,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        width: "auto",
                    }}
                >
                    <h1 onClick={() => props.setRoute("mainMenu")}>{"<"}</h1>
                    <h1>Asset Viewer</h1>
                </div>
                <div
                    style={{
                        width: "auto",
                        height: "100%",
                        display: "flex",
                    }}
                >
                    <p>{hashFileList.length}/21500</p>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <FixedSizeList
                        height={750}
                        width={400}
                        itemCount={hashFileList.length}
                        itemSize={20}
                    >
                        {({ index, style }) => (
                            <p key={index} style={style}>
                                {hashFileList[index]}
                            </p>
                        )}
                    </FixedSizeList>
                </div>
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
