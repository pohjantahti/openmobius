import { setBaseDirectoryHandle } from "@extractor/fileSystemAccess";
import {
    Container,
    Paper,
    Typography,
    Link,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
    setStartInfoComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

// Display general info about this project and instructions to get started
function StartInfo(props: Props) {
    const handleOpenFolderButton = async () => {
        await setBaseDirectoryHandle();
        props.setStartInfoComplete(true);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ padding: 2, marginTop: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h3" fontWeight="bold">
                        OpenMobius
                    </Typography>
                    <Link href="https://github.com/pohjantahti/openmobius">View on Github</Link>
                    <Box>
                        <Accordion defaultExpanded disableGutters>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ fontWeight: "bold", backgroundColor: "#212121" }}
                            >
                                What is it?
                            </AccordionSummary>
                            <AccordionDetails sx={{ backgroundColor: "#333333" }}>
                                <Typography variant="body1" marginBottom={1}>
                                    OpenMobius is an open-source, partial replication of the
                                    original Mobius Final Fantasy game. In its current form, it's a
                                    small tech demo with some interactable features.
                                </Typography>
                                <Typography>
                                    <b>Disclaimer:</b> This site is not an official Final Fantasy
                                    product and is not affiliated with nor endorsed by Square Enix.
                                    The site does not contain any original game assets and does not
                                    earn money in any way. Usage of this site's features requires
                                    the original game assets.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disableGutters>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ fontWeight: "bold", backgroundColor: "#212121" }}
                            >
                                How to use it?
                            </AccordionSummary>
                            <AccordionDetails sx={{ backgroundColor: "#333333" }}>
                                <p>
                                    <b>Base requirements:</b>
                                </p>
                                <ul>
                                    <li>Original Mobius Final Fantasy game assets (GL version)</li>
                                    <li>
                                        Browser that supports File System Access API.
                                        <a
                                            style={{ color: "#0080EE", marginLeft: 4 }}
                                            href="https://caniuse.com/native-filesystem-api"
                                        >
                                            Check compatibility.
                                        </a>
                                    </li>
                                </ul>

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
                                                in File Explorer may help you find them.
                                            </li>
                                        </ul>
                                    </li>
                                    <br />

                                    <li>
                                        Check that your game asset folder contains a folder called
                                        "mobiusff_Data" and inside it are folders "mobius_data" and
                                        "StreamingAssets".
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
                                            If the folder was the correct one, asset loading will
                                            begin.
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
                    </Box>
                    <Button variant="contained" onClick={handleOpenFolderButton}>
                        Open "mobiusff_Data" folder
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default StartInfo;
