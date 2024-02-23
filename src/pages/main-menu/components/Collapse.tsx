import { useState } from "react";

interface CollapseProps {
    title: string;
    children: React.ReactNode;
}

// Collapsible element that opens and closes when clicking the title
function Collapse(props: CollapseProps) {
    const [open, setOpen] = useState(false);
    const [hovering, setHovering] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                margin: "10px 0px",
            }}
        >
            <div
                style={{
                    height: 50,
                    backgroundColor: open || hovering ? "#212121" : "#2D2D2D",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0px 20px 0px 10px",
                    cursor: "pointer",
                }}
                onClick={() => setOpen(!open)}
                onMouseEnter={() => setHovering(!hovering)}
                onMouseLeave={() => setHovering(!hovering)}
            >
                <h2>{props.title}</h2>
                <h2 style={{ userSelect: "none" }}>{open ? "-" : "+"}</h2>
            </div>
            <div
                style={{
                    maxHeight: open ? "100%" : 0,
                    overflow: "hidden",
                    padding: open ? 10 : 0,
                    backgroundColor: "#333333",
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

export default Collapse;
