import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RouteContext, RouteOptions } from "../Router";
import ProvideGameAssets from "./components/ProvideGameAssets";
import { useContext } from "react";

interface Props {
    gameAssetsProvided: boolean;
    setGameAssetsProvided: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainMenu(props: Props) {
    const { gameAssetsProvided, setGameAssetsProvided } = props;
    const setRoute = useContext(RouteContext);

    const MainMenuCard = (props: { name: string; route: RouteOptions; disabled?: boolean }) => {
        const { name, route, disabled } = props;
        return (
            <Card>
                <CardActionArea
                    sx={{
                        height: 120,
                        display: "flex",
                        backgroundColor: disabled ? "#2F2F2F" : "inherit",
                        color: disabled ? "#6E6E6E" : "inherit",
                    }}
                    disabled={disabled}
                    onClick={() => setRoute && setRoute(route)}
                >
                    <CardContent>
                        <Typography variant="h5">{name}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    };

    return (
        <Container maxWidth="md" sx={{ padding: 2 }}>
            <Stack spacing={2}>
                <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: "bold" }}>
                        What is OpenMobius?
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography marginBottom={1}>
                            OpenMobius is an open-source, interactive archive of the Mobius Final
                            Fantasy game. In its current form, it's a small tech demo with some
                            interactable features.
                        </Typography>
                        <Typography>
                            <b>Disclaimer:</b> This site is not an official Final Fantasy product
                            and is not affiliated with nor endorsed by Square Enix. This site does
                            not contain any original game assets and does not earn money in any way.
                            Usage of game asset related features requires the user to provide their
                            own copy of the original game assets.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Typography variant="h6">General</Typography>
                <Divider />
                <MainMenuCard name="Battle Simulator" route="battleSimulator" />

                <Stack spacing={2} direction="row">
                    <Typography variant="h6">Game Asset Content</Typography>
                    {!gameAssetsProvided && (
                        <ProvideGameAssets setGameAssetsProvided={setGameAssetsProvided} />
                    )}
                </Stack>
                <Divider />
                <MainMenuCard
                    name="Asset Collections"
                    route="assetCollections"
                    disabled={!gameAssetsProvided}
                />
                <MainMenuCard
                    name="Asset Viewer"
                    route="assetViewer"
                    disabled={!gameAssetsProvided}
                />
                <MainMenuCard name="Replica" route="replica" disabled={!gameAssetsProvided} />
            </Stack>
        </Container>
    );
}

export default MainMenu;
