import { Button, Stack, Typography } from "@mui/material";
import { RouteOptions } from "../../main-menu/Router";

interface Props {
    setRoute: React.Dispatch<React.SetStateAction<RouteOptions>>;
}

function LeftBar(props: Props) {
    const { setRoute } = props;

    return (
        <Stack spacing={1} sx={{ height: 1, width: 1 }}>
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => setRoute("mainMenu")}>
                    Back
                </Button>
                <Typography variant="h5">Asset Collections</Typography>
            </Stack>
        </Stack>
    );
}

export default LeftBar;
