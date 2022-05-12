import React from "react";
import { createRoot } from "react-dom/client";
import StartMenu from "./components/view/StartMenu";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <StartMenu />
    </React.StrictMode>
);
