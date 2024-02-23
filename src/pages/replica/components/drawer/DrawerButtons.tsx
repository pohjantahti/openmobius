import { resources } from "../../extractor";

interface Props {
    cardsOpen: boolean;
    socialOpen: boolean;
    shopOpen: boolean;
    etcOpen: boolean;
    homeOpen: boolean;
    handleDrawer: (drawer: string) => void;
    showButtons: boolean;
}

function DrawerButtons(props: Props) {
    const { cardsOpen, socialOpen, shopOpen, etcOpen, homeOpen, handleDrawer, showButtons } = props;
    const open = "47.77rem";
    const normal = 0;
    const hidden = "-5rem";

    return (
        <>
            <div
                className="drawerButton"
                style={{
                    bottom: "38.87rem",
                    backgroundColor: "#2C9368",
                    right: showButtons ? (cardsOpen ? open : normal) : hidden,
                }}
                onClick={() => handleDrawer("cards")}
            >
                <img
                    src={resources["Icon: Drawer_ButtonInner_Top"]}
                    className="drawerButtonInnerTop"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Middle"]}
                    className="drawerButtonInnerMiddle"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Bottom"]}
                    className="drawerButtonInnerBottom"
                />
                <p
                    className="drawerButtonText"
                    style={{
                        marginTop: "0.9rem",
                        color: "#DEF2E9",
                    }}
                >
                    Cards
                </p>
            </div>
            <div
                className="drawerButton"
                style={{
                    bottom: "29.43rem",
                    backgroundColor: "#8B4344",
                    right: showButtons ? (socialOpen ? open : normal) : hidden,
                }}
                onClick={() => handleDrawer("social")}
            >
                <img
                    src={resources["Icon: Drawer_ButtonInner_Top"]}
                    className="drawerButtonInnerTop"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Middle"]}
                    className="drawerButtonInnerMiddle"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Bottom"]}
                    className="drawerButtonInnerBottom"
                />
                <p
                    className="drawerButtonText"
                    style={{
                        marginTop: "1rem",
                        color: "#F2E4E4",
                    }}
                >
                    Social
                </p>
            </div>
            <div
                className="drawerButton"
                style={{
                    bottom: "19.99rem",
                    backgroundColor: "#E6B479",
                    right: showButtons ? (shopOpen ? open : normal) : hidden,
                }}
                onClick={() => handleDrawer("shop")}
            >
                <img
                    src={resources["Icon: Drawer_ButtonInner_Top"]}
                    className="drawerButtonInnerTop"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Middle"]}
                    className="drawerButtonInnerMiddle"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Bottom"]}
                    className="drawerButtonInnerBottom"
                />
                <p
                    className="drawerButtonText"
                    style={{
                        marginTop: "1.2rem",
                        color: "#FDF7EB",
                    }}
                >
                    Shop
                </p>
            </div>
            <div
                className="drawerButton"
                style={{
                    bottom: "10.55rem",
                    backgroundColor: "#8654D1",
                    right: showButtons ? (etcOpen ? open : normal) : hidden,
                }}
                onClick={() => handleDrawer("etc")}
            >
                <img
                    src={resources["Icon: Drawer_ButtonInner_Top"]}
                    className="drawerButtonInnerTop"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Middle"]}
                    className="drawerButtonInnerMiddle"
                />
                <img
                    src={resources["Icon: Drawer_ButtonInner_Bottom"]}
                    className="drawerButtonInnerBottom"
                />
                <p
                    className="drawerButtonText"
                    style={{
                        marginTop: "1.5rem",
                        color: "#F0E7FC",
                    }}
                >
                    ETC
                </p>
            </div>
            <div
                className="drawerButton"
                style={{
                    width: "4.18rem",
                    bottom: "1.11rem",
                    backgroundColor: "#4B93E8",
                    right: showButtons ? normal : hidden,
                    display: homeOpen ? "none" : "inline",
                }}
                onClick={() => handleDrawer("home")}
            >
                <img
                    src={resources["Icon: Drawer_HomeButton"]}
                    style={{
                        position: "absolute",
                        height: "8.4rem",
                        opacity: 0.3,
                        top: "-0.1rem",
                    }}
                />
                <p
                    style={{
                        transform: "rotate(90deg)",
                        fontSize: "1.6rem",
                        marginTop: "0.8rem",
                        marginLeft: "2.13rem",
                        color: "#F0E7FC",
                    }}
                >
                    Home
                </p>
            </div>
        </>
    );
}

export default DrawerButtons;
