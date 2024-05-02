import React from "react";
import { createRoot } from "react-dom/client";
import Router from "./pages/Router";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <Router />
        </ThemeProvider>
    </React.StrictMode>
);
