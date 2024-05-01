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
                                <p>
                                    <b>Base requirements:</b>
                                </p>
                                <ul>
                                    <li>Original Mobius Final Fantasy game assets (GL version).</li>
                                    <li>
                                        Browser that supports the{" "}
                                        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker#browser_compatibility">
                                            showDirectoryPicker()
                                        </Link>{" "}
                                        function from the{" "}
                                        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API">
                                            File System Access API
                                        </Link>
                                        .
                                    </li>
                                </ul>
                                {supported ? (
                                    <Alert severity="success">
                                        Your current browser is compatible.
                                    </Alert>
                                ) : (
                                    <Alert severity="error">
                                        Your current browser is incompatible.
                                    </Alert>
                                )}
                                <p>
                                    <b>Instructions</b> (written for Windows but applicable to any
                                    other OS)
                                </p>
                                <ol>
                                    <li>
                                        Figure out the location of your game assets:
                                        <ul>
                                            <li>If you know this, skip to 2.</li>
                                            <li>
                                                If you do not know, they are likely in the default
                                                Steam installation location (on Windows "C:\Program
                                                Files (x86)\Steam\steamapps\common\MOBIUS FINAL
                                                FANTASY").
                                            </li>
                                            <li>
                                                If you can't find them, searching for "mobiusff.exe"
                                                in File Explorer may help you to find them.
                                            </li>
                                        </ul>
                                    </li>
                                    <br />

                                    <li>
                                        Check that your game asset folder contains a folder called
                                        "mobiusff_Data" and inside it are folders "mobius_data" and
                                        "StreamingAssets" among many others.
                                    </li>
                                    <br />

                                    <li>
                                        Make sure that your game assets are not located in a
                                        protected folder that File System Access API can't access
                                        due to security reasons. If they are, copy them to a
                                        non-protected location.
                                        <br />
                                        <br />
                                        Examples of protected folders:
                                        <ul>
                                            <li>
                                                "Program Files (x86)" (the default Steam location)
                                            </li>
                                            <li>
                                                Other Windows related folders: Program Files,
                                                Windows
                                            </li>
                                            <li>
                                                Some user folders: Downloads, Documents, Desktop
                                            </li>
                                        </ul>
                                        Examples of non-protected locations:
                                        <ul>
                                            <li>
                                                A folder in the root of your Windows drive (for
                                                example, "C:\mobiusfolder").
                                            </li>
                                            <li>A folder in another drive (A, B, D, etc.)</li>
                                            <li>Some user folders: Pictures, Music, Videos</li>
                                        </ul>
                                    </li>
                                    <br />

                                    <li>
                                        Once given access, this site will retain it to go through
                                        your game asset files, extracting the needed resources from
                                        them, as long as this site stays open in your browser. This
                                        site only reads files and will not create new or alter
                                        existing files in any way.
                                    </li>
                                    <br />

                                    <li>Click the 'Open "mobiusff_Data" folder' button below.</li>
                                    <br />

                                    <li>
                                        Use the window to select the "mobiusff_Data" folder and
                                        click "Select folder".
                                    </li>
                                    <ul>
                                        <li>
                                            If the folder was the correct one, this window will
                                            close.
                                        </li>
                                        <li>
                                            If the loading does not begin, make sure you selected
                                            the correct folder and/or go back to 2.
                                        </li>
                                        <li>
                                            If the browser popup asks you to choose another folder,
                                            go back to 3.
                                        </li>
                                        <li>
                                            If clicking the button below doesn't do anything, go
                                            back to base requirements.
                                        </li>
                                    </ul>
                                </ol>
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
