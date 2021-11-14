import React from "react";
import ReactDOM from "react-dom";
import StartMenu from "./components/view/StartMenu";
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <StartMenu />
    </React.StrictMode>,
    document.getElementById("root")
);

// TODO: Get rid of "any" types
