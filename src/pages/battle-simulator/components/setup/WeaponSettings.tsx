import { Stack, TextField, Typography } from "@mui/material";
import { SetupBattleFormContext } from "./SetupBattle";
import { useContext } from "react";
import { Controller } from "react-hook-form";

interface Props {
    isMainDeck: boolean;
}

function WeaponSettings(props: Props) {
    const { control, errors } = useContext(SetupBattleFormContext);
    const { isMainDeck } = props;

    const weapon = isMainDeck ? `mainDeck.weapon` : `subDeck.weapon`;
    const weaponErrors = isMainDeck ? errors.mainDeck?.weapon : errors.subDeck?.weapon;

    return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Stack spacing={1} width={1} paddingBottom={2}>
                <Typography>General</Typography>
                <Controller
                    name={`${weapon}.name`}
                    control={control}
                    render={({ field }) => <TextField {...field} label="Name" size="small" />}
                />
            </Stack>

            <Stack spacing={1} width={1}>
                <Typography>Stats</Typography>
                <Controller
                    name={`${weapon}.stats.hp`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="HP"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.hp?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.hp?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.attack`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Attack"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.attack?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.attack?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.breakPower`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Break Power"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.breakPower?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.breakPower?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.magic`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Magic"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.magic?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.magic?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.critical`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Critical"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.critical?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.critical?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.speed`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Speed"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.speed?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.speed?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
                <Controller
                    name={`${weapon}.stats.defense`}
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Defense"
                            size="small"
                            type="number"
                            error={weaponErrors?.stats?.defense?.type === "min"}
                            helperText={
                                weaponErrors?.stats?.defense?.type === "min" && "Incorrect value"
                            }
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
}

export default WeaponSettings;
