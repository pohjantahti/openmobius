import { useState } from "react";
import DrawerScrollList from "./DrawerScrollList";
import PlayerInfo from "./PlayerInfo";
import { resources } from "../../extractor";

interface Props {
    name: string;
    show: boolean;
    gradientColors: Array<string>;
    content: JSX.Element;
    drawerScrollHeight: string;
    drawerScrollInfo: any;
}

function DrawerPage(props: Props) {
    const { name, show, gradientColors, content, drawerScrollHeight, drawerScrollInfo } = props;

    const [scrollInfo, setScrollInfo]: any = useState({});

    const handleMouseMove = (e: any) => {
        if (scrollInfo.mouseDown) {
            const element: any = document.getElementById(`scroll${name}`);
            element.scrollTop = scrollInfo.top - (e.clientY - scrollInfo.y);
        }
    };

    const handleMouseDown = (e: any, mouseDown: boolean) => {
        const element: any = document.getElementById(`scroll${name}`);
        setScrollInfo({
            mouseDown: mouseDown,
            top: element.scrollTop,
            y: e.clientY,
        });
    };

    return (
        <div
            style={{
                position: "absolute",
                transition: "right 0.2s",
                right: show ? 0 : "-47.77rem",
                width: "47.77rem",
                height: "100%",
                backgroundImage: `linear-gradient(${gradientColors[0]}, ${gradientColors[1]})`,
                top: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 10,
            }}
        >
            <img
                src={resources["Icon: Drawer_BackgroundIcon"]}
                style={{
                    height: "50rem",
                    position: "absolute",
                    top: "49rem",
                    left: "22.5rem",
                    opacity: 0.1,
                }}
            />
            <img
                src={resources["Icon: Drawer_BackgroundIcon"]}
                style={{
                    height: "20rem",
                    position: "absolute",
                    top: "5.7rem",
                    left: "12.5rem",
                    opacity: 0.15,
                }}
            />
            <img
                src={resources["Icon: Drawer_BackgroundGradient"]}
                style={{
                    height: "100rem",
                    position: "absolute",
                    top: "27rem",
                    left: "-50rem",
                    opacity: 0.3,
                }}
            />

            <PlayerInfo />

            <div
                style={{
                    height: "100rem",
                    width: "41.67rem",
                    marginLeft: "1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1,
                }}
            >
                {content}
                <div
                    style={{
                        height: "55rem",
                        width: "41.67rem",
                    }}
                >
                    <div
                        style={{
                            height: "2.4rem",
                            margin: 0,
                        }}
                    >
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.2rem",
                                margin: "0 0 -0.4rem",
                            }}
                        >
                            {name}
                        </p>
                        <div style={{ border: "1px solid #FFFFFF88" }} />
                    </div>
                    <div
                        style={{
                            overflowY: "hidden",
                            height: drawerScrollHeight,
                        }}
                        id={`scroll${name}`}
                        onMouseMove={handleMouseMove}
                        onMouseDown={(e) => handleMouseDown(e, true)}
                        onMouseUp={(e) => handleMouseDown(e, false)}
                        onMouseLeave={(e) => handleMouseDown(e, false)}
                    >
                        <DrawerScrollList items={drawerScrollInfo} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DrawerPage;
