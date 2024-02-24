import { useEffect, useRef, useState } from "react";
import { RouteOptions } from "../main-menu/Router";
import { getHashFileList } from "@extractor/fileSystemAccess";
import { FixedSizeList } from "react-window";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

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
        <Stack
            direction="row"
            spacing={1}
            padding={1}
            sx={{
                position: "absolute",
                height: 1,
                width: 1,
            }}
        >
            <Paper sx={{ height: 1 }}>
                <Stack spacing={1} padding={1} sx={{ height: 1, width: "416px" }}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" onClick={() => props.setRoute("mainMenu")}>
                            Back
                        </Button>
                        <Typography variant="h5">Asset Viewer</Typography>
                    </Stack>
                    {hashFileList.length === 0 ? (
                        <Box
                            sx={{
                                height: 1,
                                width: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body1">Loading...</Typography>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: 1,
                                width: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                            }}
                        >
                            <FixedSizeList
                                height={750}
                                width={400}
                                itemCount={hashFileList.length}
                                itemSize={20}
                            >
                                {({ index, style }) => (
                                    <Typography variant="body2" key={index} style={style}>
                                        {hashFileList[index]}
                                    </Typography>
                                )}
                            </FixedSizeList>
                        </Box>
                    )}
                </Stack>
            </Paper>
            <Paper sx={{ width: 1 }}>
                <Typography>Assets</Typography>
            </Paper>
        </Stack>
    );
}

export default AssetViewer;
