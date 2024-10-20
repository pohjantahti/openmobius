import { CardInfo, JobInfo, WeaponInfo } from "@battle/types";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { createContext } from "react";
import { Control, FieldErrors, SubmitHandler, UseFormWatch, useForm } from "react-hook-form";
import PlayerOverview from "./PlayerOverview";

interface Props {
    setSetupComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BattleSetupConfig {
    mainDeck: {
        job: JobInfo;
        weapon: WeaponInfo;
        cards: Array<CardInfo>;
    };
    subDeck: {
        job: JobInfo;
        weapon: WeaponInfo;
        cards: Array<CardInfo>;
    };
}

const defaultJob: JobInfo = {
    id: 0,
    name: "Default Job",
    class: "warrior",
    stats: {
        hp: 10200,
        attack: 650,
        breakPower: 500,
        magic: 450,
        critical: 3,
        speed: 4,
        defense: 5,
    },
    elements: ["fire", "water", "wind"],
};

const defaultCard: CardInfo = {
    id: 0,
    name: "Default Card",
    class: "warrior",
    element: "fire",
    ability: {
        name: "Amazing Ability",
        cost: 3,
        attack: 800,
        breakPower: 600,
        critical: 3,
        target: "single",
        hits: 1,
    },
};

const defaultWeapon: WeaponInfo = {
    id: 0,
    name: "Default Weapon",
    stats: {
        hp: 2000,
        attack: 200,
        breakPower: 200,
        magic: 200,
        critical: 5,
        speed: 5,
        defense: 5,
    },
};

interface FormContextType {
    watch: UseFormWatch<BattleSetupConfig>;
    control: Control<BattleSetupConfig, any>; // eslint-disable-line
    errors: FieldErrors<BattleSetupConfig>;
}

const SetupBattleFormContext = createContext<FormContextType>({} as FormContextType);

function SetupBattle(props: Props) {
    const { setSetupComplete } = props;

    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<BattleSetupConfig>({
        defaultValues: {
            mainDeck: {
                job: JSON.parse(JSON.stringify(defaultJob)),
                weapon: JSON.parse(JSON.stringify(defaultWeapon)),
                cards: [
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                ],
            },
            subDeck: {
                job: JSON.parse(JSON.stringify(defaultJob)),
                weapon: JSON.parse(JSON.stringify(defaultWeapon)),
                cards: [
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                    JSON.parse(JSON.stringify(defaultCard)),
                ],
            },
        },
        mode: "onChange",
    });

    const handleSetupReady: SubmitHandler<BattleSetupConfig> = (data) => {
        console.log("Setup complete");
        console.log(data);
        setSetupComplete(true);
    };

    return (
        <Container maxWidth="md" sx={{ padding: 1 }}>
            <Paper sx={{ width: 1 }}>
                <Stack spacing={1} padding={1}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h5">Player Settings</Typography>
                        <Button variant="contained" onClick={handleSubmit(handleSetupReady)}>
                            Start Battle
                        </Button>
                    </Stack>

                    <SetupBattleFormContext.Provider
                        value={{ watch: watch, control: control, errors: errors }}
                    >
                        <PlayerOverview />
                    </SetupBattleFormContext.Provider>
                </Stack>
            </Paper>
        </Container>
    );
}

export default SetupBattle;
export { SetupBattleFormContext };
export type { BattleSetupConfig };
