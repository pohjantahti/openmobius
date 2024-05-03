import { Autocomplete, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ClassID } from "@extractor/consts";

interface Props {
    currentTab: number;
    index: number;
    handleDisplayedAsset: (
        containerPath: string,
        pathId: string,
        classId: number,
        collection?: boolean
    ) => void;
}

function CollectionViewerPanel(props: Props) {
    const { currentTab, index, handleDisplayedAsset } = props;
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

    const handleChangeInput = (_: React.SyntheticEvent, newValue: string | null) => {
        if (newValue && newValue.length > 0) {
            handleDisplayedAsset("", newValue, ClassID.Mesh, true);
        }
    };

    return (
        <div hidden={currentTab !== index}>
            <Stack spacing={1} height={1} marginTop={1}>
                <Autocomplete
                    onChange={handleChangeInput}
                    inputValue={jobOptionsInput}
                    onInputChange={(_, newInput) => setJobOptionsInput(newInput)}
                    options={jobOptions}
                    renderInput={(params) => <TextField {...params} label="Job ID" />}
                />
            </Stack>
        </div>
    );
}

export default CollectionViewerPanel;
