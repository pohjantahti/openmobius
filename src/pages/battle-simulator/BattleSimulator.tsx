import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import SetupBattle from "./components/setup/SetupBattle";

function BattleSimulator() {
    const [setupComplete, setSetupComplete] = useState(false);
    return (
        <>
            {setupComplete ? (
                <Container maxWidth="md" sx={{ padding: 1 }}>
                    <Paper>
                        <Stack padding={2} alignItems="center" spacing={1}>
                            <Typography>Battle begins</Typography>
                            <Button variant="contained" onClick={() => setSetupComplete(false)}>
                                End Battle
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            ) : (
                <SetupBattle setSetupComplete={setSetupComplete} />
            )}
        </>
    );
}

export default BattleSimulator;
