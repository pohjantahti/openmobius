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
    index: number;
    isMainDeck: boolean;
}

function CardSettings(props: Props) {
    const { control, errors } = useContext(SetupBattleFormContext);
    const { index, isMainDeck } = props;

    const card = isMainDeck ? `mainDeck.cards` : `subDeck.cards`;
    const cardErrors = isMainDeck ? errors.mainDeck?.cards : errors.subDeck?.cards;

    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Stack spacing={1} width={1} paddingBottom={2}>
                <Typography>General</Typography>
                <Controller
                    name={`${card}.${index}.name`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Name" size="small" />}
                />
                <Controller
                    name={`${card}.${index}.class`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small">
                            <InputLabel>Class</InputLabel>
                            <Select {...field} label="Class">
                                <MenuItem value="warrior">Warrior</MenuItem>
                                <MenuItem value="ranger">Range</MenuItem>
                                <MenuItem value="mage">Mage</MenuItem>
                                <MenuItem value="monk">Monk</MenuItem>
                                <MenuItem value="monk">Support</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name={`${card}.${index}.element`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small">
                            <InputLabel>Element</InputLabel>
                            <Select {...field} label="Element">
                                <MenuItem value="fire">Fire</MenuItem>
                                <MenuItem value="water">Water</MenuItem>
                                <MenuItem value="earth">Earth</MenuItem>
                                <MenuItem value="wind">Wind</MenuItem>
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                                <MenuItem value="life">Life</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Stack>

            <Stack spacing={1} width={1}>
                <Typography>Ability</Typography>
                <Controller
                    name={`${card}.${index}.ability.name`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Name" size="small" />}
                />
                <Controller
                    name={`${card}.${index}.ability.cost`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Cost"
                            size="small"
                            type="number"
                            error={cardErrors && cardErrors[index]?.ability?.cost?.type === "min"}
                            helperText={
                                cardErrors &&
                                cardErrors[index]?.ability?.cost?.type === "min" &&
                                "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${card}.${index}.ability.attack`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Attack"
                            size="small"
                            type="number"
                            error={cardErrors && cardErrors[index]?.ability?.attack?.type === "min"}
                            helperText={
                                cardErrors &&
                                cardErrors[index]?.ability?.attack?.type === "min" &&
                                "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${card}.${index}.ability.breakPower`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="BreakPower"
                            size="small"
                            type="number"
                            error={
                                cardErrors && cardErrors[index]?.ability?.breakPower?.type === "min"
                            }
                            helperText={
                                cardErrors &&
                                cardErrors[index]?.ability?.breakPower?.type === "min" &&
                                "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${card}.${index}.ability.critical`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Critical"
                            size="small"
                            type="number"
                            error={
                                cardErrors && cardErrors[index]?.ability?.critical?.type === "min"
                            }
                            helperText={
                                cardErrors &&
                                cardErrors[index]?.ability?.critical?.type === "min" &&
                                "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${card}.${index}.ability.target`}
                    control={control}
                    render={({ field }) => (
                        <FormControl size="small">
                            <InputLabel>Target</InputLabel>
                            <Select {...field} label="Target">
                                <MenuItem value="single">Single</MenuItem>
                                <MenuItem value="cone">Cone</MenuItem>
                                <MenuItem value="aoe">AoE</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    name={`${card}.${index}.ability.hits`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Hits"
                            size="small"
                            type="number"
                            error={cardErrors && cardErrors[index]?.ability?.hits?.type === "min"}
                            helperText={
                                cardErrors &&
                                cardErrors[index]?.ability?.hits?.type === "min" &&
                                "Incorrect value"
                            }
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
}

export default CardSettings;
