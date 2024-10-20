import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import CardSettings from "./CardSettings";
import JobSettings from "./JobSettings";
import DeckSettings from "./DeckSettings";
import WeaponSettings from "./WeaponSettings";

function PlayerOverview() {
    const [isMainDeck, setIsMainDeck] = useState(true);
    const [dialogOptions, setDialogOptions] = useState({ type: "job", index: 0, show: false });

    const handleShowDialog = (action: "job" | "weapon" | "card" | "close", index = 0) => {
        if (action === "close") {
            setDialogOptions({
                ...dialogOptions,
                show: false,
            });
        } else {
            setDialogOptions({
                type: action,
                index: index,
                show: true,
            });
        }
    };

    return (
        <>
            <Card sx={{ backgroundColor: "#333333" }}>
                <CardHeader
                    avatar={
                        <Button
                            variant={isMainDeck ? "contained" : "outlined"}
                            startIcon={<CachedIcon />}
                            onClick={() => setIsMainDeck(!isMainDeck)}
                        >
                            {isMainDeck ? "Main" : "Sub"}
                        </Button>
                    }
                    title={<Typography>Deck Settings</Typography>}
                />
                <CardContent>
                    <DeckSettings isMainDeck={isMainDeck} handleShowDialog={handleShowDialog} />
                </CardContent>
            </Card>

            <Dialog open={dialogOptions.show} onClose={() => handleShowDialog("close")}>
                <DialogContent>
                    <DialogTitle sx={{ paddingTop: 0, paddingLeft: 0 }}>
                        {dialogOptions.type === "job" && "Job Settings"}
                        {dialogOptions.type === "weapon" && "Weapon Settings"}
                        {dialogOptions.type === "card" && "Card Settings"}
                    </DialogTitle>
                    {dialogOptions.type === "job" && <JobSettings isMainDeck={isMainDeck} />}
                    {dialogOptions.type === "weapon" && <WeaponSettings isMainDeck={isMainDeck} />}
                    {dialogOptions.type === "card" && (
                        <CardSettings index={dialogOptions.index} isMainDeck={isMainDeck} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default PlayerOverview;
