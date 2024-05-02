import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            paper: "#3D3D3D",
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: "#212121",
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    backgroundColor: "#333333",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#212121",
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                standardError: {
                    backgroundColor: "#2a1515",
                },
                standardSuccess: {
                    backgroundColor: "#162717",
                },
            },
        },
    },
});

export { darkTheme };
