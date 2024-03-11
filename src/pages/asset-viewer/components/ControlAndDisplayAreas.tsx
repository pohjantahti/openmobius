import { Paper, Stack } from "@mui/material";

interface Props {
    left: React.ReactElement;
    leftWidth: number | string | undefined;
    right: React.ReactElement;
}

function ControlAndDisplayAreas(props: Props) {
    const { left, leftWidth, right } = props;
    return (
        <Stack
            direction="row"
            spacing={1}
            padding={1}
            sx={{
                position: "absolute",
                height: 1,
                width: 1,
            }}
        >
            <Paper sx={{ height: 1, minWidth: leftWidth, padding: 1 }}>{left}</Paper>
            <Paper sx={{ height: 1, width: 1, padding: 1 }}>{right}</Paper>
        </Stack>
    );
}

export default ControlAndDisplayAreas;
