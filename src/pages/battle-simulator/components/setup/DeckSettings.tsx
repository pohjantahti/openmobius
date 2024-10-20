import { Card, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import DatasetIcon from "@mui/icons-material/Dataset";
import { useContext } from "react";
import { SetupBattleFormContext } from "./SetupBattle";

interface Props {
    isMainDeck: boolean;
    handleShowDialog: (action: "job" | "weapon" | "card" | "close", index?: number) => void;
}

function DeckSettings(props: Props) {
    const { watch } = useContext(SetupBattleFormContext);
    const { isMainDeck, handleShowDialog } = props;

    const deck = isMainDeck ? "mainDeck" : "subDeck";

    return (
        <Stack spacing={1}>
            <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<PersonIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("job")}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.job.name`)}</Typography>}
                    />
                </Card>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<BuildIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("weapon")}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.weapon.name`)}</Typography>}
                    />
                </Card>
            </Stack>
            <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<DatasetIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("card", 0)}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.cards.0.name`)}</Typography>}
                    />
                </Card>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<DatasetIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("card", 1)}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.cards.1.name`)}</Typography>}
                    />
                </Card>
            </Stack>
            <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<DatasetIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("card", 2)}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.cards.2.name`)}</Typography>}
                    />
                </Card>
                <Card sx={{ width: 1 }}>
                    <CardHeader
                        avatar={<DatasetIcon />}
                        action={
                            <IconButton onClick={() => handleShowDialog("card", 3)}>
                                <EditIcon />
                            </IconButton>
                        }
                        title={<Typography>{watch(`${deck}.cards.3.name`)}</Typography>}
                    />
                </Card>
            </Stack>
        </Stack>
    );
}

export default DeckSettings;
