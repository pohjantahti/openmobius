import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { SetupBattleFormContext } from "./SetupBattle";
import { useContext } from "react";
import { Controller } from "react-hook-form";

interface Props {
    isMainDeck: boolean;
}

function JobSettings(props: Props) {
    const { control, errors } = useContext(SetupBattleFormContext);
    const { isMainDeck } = props;

    const job = isMainDeck ? "mainDeck.job" : "subDeck.job";
    const jobErrors = isMainDeck ? errors.mainDeck?.job : errors.subDeck?.job;

    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Stack spacing={1} width={1} paddingBottom={2}>
                <Typography>General</Typography>
                <Controller
                    name={`${job}.name`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Name" size="small" />}
                />
                <Controller
                    name={`${job}.class`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small">
                            <InputLabel>Class</InputLabel>
                            <Select {...field} label="Class">
                                <MenuItem value="warrior">Warrior</MenuItem>
                                <MenuItem value="ranger">Range</MenuItem>
                                <MenuItem value="mage">Mage</MenuItem>
                                <MenuItem value="monk">Monk</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Typography variant="body2">Elements</Typography>
                <Controller
                    name={`${job}.elements.0`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small" sx={{ width: 1 }}>
                            <Select {...field}>
                                <MenuItem value="fire">Fire</MenuItem>
                                <MenuItem value="water">Water</MenuItem>
                                <MenuItem value="earth">Earth</MenuItem>
                                <MenuItem value="wind">Wind</MenuItem>
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name={`${job}.elements.1`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small" sx={{ width: 1 }}>
                            <Select {...field}>
                                <MenuItem value="fire">Fire</MenuItem>
                                <MenuItem value="water">Water</MenuItem>
                                <MenuItem value="earth">Earth</MenuItem>
                                <MenuItem value="wind">Wind</MenuItem>
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name={`${job}.elements.2`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small" sx={{ width: 1 }}>
                            <Select {...field}>
                                <MenuItem value="fire">Fire</MenuItem>
                                <MenuItem value="water">Water</MenuItem>
                                <MenuItem value="earth">Earth</MenuItem>
                                <MenuItem value="wind">Wind</MenuItem>
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Stack>

            <Stack spacing={1} width={1}>
                <Typography>Stats</Typography>
                <Controller
                    name={`${job}.stats.hp`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="HP"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.hp?.type === "min"}
                            helperText={jobErrors?.stats?.hp?.type === "min" && "Incorrect value"}
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.attack`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Attack"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.attack?.type === "min"}
                            helperText={
                                jobErrors?.stats?.attack?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.breakPower`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Break Power"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.breakPower?.type === "min"}
                            helperText={
                                jobErrors?.stats?.breakPower?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.magic`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Magic"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.magic?.type === "min"}
                            helperText={
                                jobErrors?.stats?.magic?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.critical`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Critical"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.critical?.type === "min"}
                            helperText={
                                jobErrors?.stats?.critical?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.speed`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Speed"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.speed?.type === "min"}
                            helperText={
                                jobErrors?.stats?.speed?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${job}.stats.defense`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Defense"
                            size="small"
                            type="number"
                            error={jobErrors?.stats?.defense?.type === "min"}
                            helperText={
                                jobErrors?.stats?.defense?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
}

export default JobSettings;
