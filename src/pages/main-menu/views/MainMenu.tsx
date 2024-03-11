import { Card, CardActionArea, CardContent, Container, Stack, Typography } from "@mui/material";
import { RouteOptions } from "../Router";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function MainMenu(props: Props) {
    const { setRoute } = props;
    return (
        <Container maxWidth="md" sx={{ padding: 2 }}>
            <Stack spacing={2}>
                <Card
                    sx={{
                        height: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" fontWeight="bold">
                            OpenMobius
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ width: 1 }} onClick={() => setRoute("assetCollections")}>
                    <CardActionArea
                        sx={{
                            height: 120,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Asset Collections</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card sx={{ width: 1 }} onClick={() => setRoute("assetViewer")}>
                    <CardActionArea
                        sx={{
                            height: 120,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Asset Viewer</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card sx={{ width: 1 }} onClick={() => setRoute("replica")}>
                    <CardActionArea
                        sx={{
                            height: 120,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Replica</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Stack>
        </Container>
    );
}

export default MainMenu;
