import { setBaseDirectoryHandle } from "@extractor/fileSystemAccess";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Alert,
    Link,
    Typography,
    List,
    ListItemText,
    ListItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface Props {
    setGameAssetsProvided: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProvideGameAssets(props: Props) {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const supported = typeof window.showDirectoryPicker === "function";

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setErrorMessage("");
    };

    const handleOpenFolderButton = async () => {
        try {
            await setBaseDirectoryHandle();
            props.setGameAssetsProvided(true);
            handleCloseDialog();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    const Ol = (props: { children: React.ReactNode }) => {
        return <List sx={{ listStyle: "decimal", paddingLeft: 3 }}>{props.children}</List>;
    };

    const Ul = (props: { children: React.ReactNode }) => {
        return <List sx={{ listStyle: "disc", padding: 0, paddingLeft: 3 }}>{props.children}</List>;
    };

    const Li = (props: { children: React.ReactNode }) => {
        return (
            <ListItem sx={{ display: "list-item", padding: 0 }}>
                <ListItemText sx={{ margin: 0 }}>{props.children}</ListItemText>
            </ListItem>
        );
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpenDialog}>
                Provide Game Assets
            </Button>
            <Dialog open={open} onClose={handleCloseDialog}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <DialogTitle>Provide Game Assets</DialogTitle>
                    <IconButton onClick={handleCloseDialog} sx={{ marginRight: 2, height: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <DialogContent>
                    <Stack spacing={2}>
                        <Accordion disableGutters>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ fontWeight: "bold" }}
                            >
                                What to do?
                            </AccordionSummary>
                            <AccordionDetails sx={{ height: 400, overflowY: "auto" }}>
                                <Typography>
                                    <b>Base requirements:</b>
                                </Typography>
                                <Ul>
                                    <Li>Original Mobius Final Fantasy game assets (GL version).</Li>
                                    <Li>
                                        Browser that supports the{" "}
                                        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker#browser_compatibility">
                                            showDirectoryPicker()
                                        </Link>{" "}
                                        function from the{" "}
                                        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API">
                                            File System Access API
                                        </Link>
                                        .
                                    </Li>
                                </Ul>
                                <br />

                                {supported ? (
                                    <Alert severity="success">
                                        Your current browser is compatible.
                                    </Alert>
                                ) : (
                                    <Alert severity="error">
                                        Your current browser is incompatible.
                                    </Alert>
                                )}
                                <br />

                                <Typography>
                                    <b>Instructions</b> (written for Windows but applicable to any
                                    other OS)
                                </Typography>

                                <Ol>
                                    <Li>Figure out the location of your game assets:</Li>
                                    <Ul>
                                        <Li>If you know this, skip to 2.</Li>
                                        <Li>If you know this, skip to 2.</Li>
                                    </Ul>
                                    <br />

                                    <Li>
                                        Check that your game asset folder contains a folder called
                                        "mobiusff_Data" and inside it are folders "mobius_data" and
                                        "StreamingAssets" among many others.
                                    </Li>
                                    <br />

                                    <Li>
                                        Make sure that your game assets are not located in a
                                        protected folder that File System Access API can't access
                                        due to security reasons. If they are, copy them to a
                                        non-protected location.
                                    </Li>
                                    <br />

                                    <ListItemText>Examples of protected folders:</ListItemText>
                                    <Ul>
                                        <Li>"Program Files (x86)" (the default Steam location)</Li>
                                        <Li>
                                            Other Windows related folders: Program Files, Windows
                                        </Li>
                                        <Li>Some user folders: Downloads, Documents, Desktop</Li>
                                    </Ul>
                                    <br />

                                    <ListItemText>
                                        Examples of non-protected locations:
                                    </ListItemText>
                                    <Ul>
                                        <Li>
                                            A folder in the root of your Windows drive (for example,
                                            "C:\mobiusfolder").
                                        </Li>
                                        <Li>A folder in another drive (A, B, D, etc.)</Li>
                                        <Li>Some user folders: Pictures, Music, Videos</Li>
                                    </Ul>
                                    <br />

                                    <Li>
                                        Once given access, this site will retain it to go through
                                        your game asset files, extracting the needed resources from
                                        them, as long as this site stays open in your browser. This
                                        site only reads files and will not create new or alter
                                        existing files in any way.
                                    </Li>
                                    <br />

                                    <Li>Click the 'Open "mobiusff_Data" folder' button below.</Li>
                                    <br />

                                    <Li>
                                        Use the window to select the "mobiusff_Data" folder and
                                        click "Select folder".
                                    </Li>
                                    <Ul>
                                        <Li>
                                            If the folder was the correct one, this window will
                                            close.
                                        </Li>
                                        <Li>
                                            If the loading does not begin, make sure you selected
                                            the correct folder and/or go back to 2.
                                        </Li>
                                        <Li>
                                            If the browser popup asks you to choose another folder,
                                            go back to 3.
                                        </Li>
                                        <Li>
                                            If clicking the button below doesn't do anything, go
                                            back to base requirements.
                                        </Li>
                                    </Ul>
                                </Ol>
                            </AccordionDetails>
                        </Accordion>

                        {errorMessage.length > 0 && <Alert severity="error">{errorMessage}</Alert>}

                        <Button
                            disabled={!supported}
                            variant="contained"
                            onClick={handleOpenFolderButton}
                        >
                            Open "mobiusff_Data" folder
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProvideGameAssets;
