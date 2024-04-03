import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import { RouteOptions } from "../../main-menu/Router";
import { useEffect, useState } from "react";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
    handleSelectedJobId: (newJobId: string) => void;
}

function LeftBar(props: Props) {
    const { setRoute, handleSelectedJobId } = props;

    const [jobOptions, setJobOptions] = useState<Array<string>>([]);
    const [jobOptionsInput, setJobOptionsInput] = useState("");

    useEffect(() => {
        const getJobIds = async () => {
            const file = await fetch("./assets/containers.json");
            const containers: Array<{ container: string; name: string }> = await file.json();

            const jobIds: Array<string> = [];
            const jobRegex = new RegExp("CAB-pr\\d{4}_win");
            const jobIdRegex = new RegExp("pr\\d{4}");
            for (const container of containers) {
                if (jobRegex.test(container.name)) {
                    if (container) {
                        const id = container.name.match(jobIdRegex)!;
                        jobIds.push(id[0]);
                    }
                }
            }
            jobIds.sort();
            setJobOptions(jobIds);
        };

        getJobIds();
    }, []);

    return (
        <Stack spacing={1} sx={{ height: 1, width: 1 }}>
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => setRoute("mainMenu")}>
                    Back
                </Button>
                <Typography variant="h5">Asset Collections</Typography>
            </Stack>

            <Autocomplete
                onChange={(_, newValue) => handleSelectedJobId(newValue || "")}
                inputValue={jobOptionsInput}
                onInputChange={(_, newInput) => setJobOptionsInput(newInput)}
                options={jobOptions}
                renderInput={(params) => <TextField {...params} label="Job ID" />}
            />
        </Stack>
    );
}

export default LeftBar;
