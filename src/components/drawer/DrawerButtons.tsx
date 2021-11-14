import { resources } from "../../extractor";

function DrawerButtons(props: any) {
    const { cardsOpen, socialOpen, shopOpen, etcOpen, homeOpen, handleDrawer } = props;

    return (
        <>
            <div
                className="drawerButton"
                style={{
                    bottom: "38.87rem",
                    backgroundColor: "#2C9368",
                    right: cardsOpen ? "47.77rem" : 0,
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
                    right: socialOpen ? "47.77rem" : 0,
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
                    right: shopOpen ? "47.77rem" : 0,
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
                    right: etcOpen ? "47.77rem" : 0,
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
                    right: 0,
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
                    className="drawerButtonText"
                    style={{
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
