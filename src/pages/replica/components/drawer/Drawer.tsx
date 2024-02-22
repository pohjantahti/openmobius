import { useState, useEffect } from "react";
import DrawerPage from "./DrawerPage";
import DrawerButtons from "./DrawerButtons";
import CardsInfo from "./CardsInfo";
import SocialInfo from "./SocialInfo";
import BannerInfo from "./BannerInfo";
import drawerScrollInfo from "./DrawerScrollInfo";
import { resources } from "../../extractor";
import "./drawer.css";

interface Props {
    showButtons: boolean;
}

function Drawer(props: Props) {
    const { showButtons } = props;
    const [cardsOpen, setCardsOpen] = useState(false);
    const [socialOpen, setSocialOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [etcOpen, setEtcOpen] = useState(false);
    const [homeOpen, setHomeOpen] = useState(true);
    const [homeWasOpen, setHomeWasOpen] = useState(true);

    const handleDrawer = (drawer: string) => {
        switch (drawer) {
            case "home":
                if (cardsOpen || socialOpen || shopOpen || etcOpen) {
                    setCardsOpen(false);
                    setSocialOpen(false);
                    setShopOpen(false);
                    setEtcOpen(false);
                    setHomeOpen(homeWasOpen);
                    setHomeWasOpen(false);
                } else {
                    setHomeOpen(!homeOpen);
                }
                break;
            case "close":
                setEtcOpen(false);
                setCardsOpen(false);
                setSocialOpen(false);
                setShopOpen(false);
                setHomeOpen(homeWasOpen);
                setHomeWasOpen(false);
                break;
            default:
                setCardsOpen(drawer === "cards" && !cardsOpen);
                setSocialOpen(drawer === "social" && !socialOpen);
                setShopOpen(drawer === "shop" && !shopOpen);
                setEtcOpen(drawer === "etc" && !etcOpen);
                if (!homeWasOpen) {
                    setHomeWasOpen(homeOpen);
                }
                setHomeOpen(false);
                break;
        }
    };

    const [localTime, setLocalTime] = useState({ time: "", date: "" });
    const [serverTime, setServerTime] = useState({ time: "", date: "" });

    useEffect(() => {
        const _local = new Date();
        const _server = new Date(_local.getTime() + (_local.getTimezoneOffset() - 480) * 60000);
        setLocalTime({
            time: `${_local.getHours()}:${_local.getMinutes()}`,
            date: `${_local.getMonth() + 1}/${_local.getDate()}/${_local.getFullYear()}`,
        });
        setServerTime({
            time: `${_server.getHours()}:${_server.getMinutes()}`,
            date: `${_server.getMonth() + 1}/${_server.getDate()}/${_server.getFullYear()}`,
        });
        const interval = setInterval(() => {
            const local = new Date();
            if (local.getSeconds() === 0) {
                // UTC-8 time
                const server = new Date(
                    local.getTime() + (local.getTimezoneOffset() - 480) * 60000
                );
                setLocalTime({
                    time: `${local.getHours()}:${local.getMinutes()}`,
                    date: `${local.getMonth() + 1}/${local.getDate()}/${local.getFullYear()}`,
                });
                setServerTime({
                    time: `${server.getHours()}:${server.getMinutes()}`,
                    date: `${server.getMonth() + 1}/${server.getDate()}/${server.getFullYear()}`,
                });
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            {/* Area next to drawer on the left */}
            <div
                style={{
                    position: "absolute",
                    left: cardsOpen || socialOpen || shopOpen || etcOpen ? 0 : "-100%",
                    top: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 10,
                }}
                onClick={() => handleDrawer("close")}
            >
                <div
                    style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        opacity: cardsOpen || socialOpen || shopOpen || etcOpen ? 0.6 : 0,
                        transition: "opacity 0.2s",
                    }}
                />

                {/* Logo and drawer tab name in the right top corner */}
                <div
                    style={{
                        position: "absolute",
                        top: "2.5rem",
                        right: "48.2rem",
                    }}
                >
                    <img
                        src={resources["Icon: Drawer_CardsLogo"]}
                        style={{
                            height: "6.6rem",
                            opacity: 0.4,
                        }}
                    />
                    <p
                        style={{
                            position: "absolute",
                            top: "5rem",
                            right: "-0.8rem",
                            fontSize: "6rem",
                            color: "#FFFFFF",
                            width: "6.6rem",
                            transform: "rotate(90deg)",
                            opacity: 0.6,
                            letterSpacing: etcOpen ? "0.4rem" : 0,
                        }}
                    >
                        {(cardsOpen && "Cards") ||
                            (socialOpen && "Social") ||
                            (shopOpen && "Shop") ||
                            (etcOpen && "ETC")}
                    </p>
                </div>

                {/* Time display in the bottom left corner */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            marginBottom: "0.2rem",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "1.8rem",
                                color: "#FFFFFF",
                                lineHeight: "2.3rem",
                                width: "7rem",
                            }}
                        >
                            {serverTime.time}
                            <br />
                            {serverTime.date}
                            <br />
                        </p>
                        <p
                            style={{
                                fontSize: "1.1rem",
                                color: "#FFFFFF",
                                lineHeight: "2.6rem",
                            }}
                        >
                            (UTC-8)
                        </p>
                    </div>
                    <p
                        style={{
                            fontSize: "1.8rem",
                            color: "#FFFFFF",
                            lineHeight: "2.3rem",
                            opacity: 0.8,
                        }}
                    >
                        {localTime.time}
                        <br />
                        {localTime.date}
                        <br />
                    </p>
                </div>
            </div>

            <DrawerPage
                name={"Cards"}
                show={cardsOpen}
                gradientColors={["#1D5B44", "#197954"]}
                content={<CardsInfo />}
                drawerScrollHeight={"52.4rem"}
                drawerScrollInfo={drawerScrollInfo.cards}
            />

            <DrawerPage
                name={"Social"}
                show={socialOpen}
                gradientColors={["#713131", "#6F2728"]}
                content={<SocialInfo />}
                drawerScrollHeight={"53.6rem"}
                drawerScrollInfo={drawerScrollInfo.social}
            />

            <DrawerPage
                name={"Shop"}
                show={shopOpen}
                gradientColors={["#7D4F11", "#A97529"]}
                content={<BannerInfo type={"shop"} />}
                drawerScrollHeight={"53.6rem"}
                drawerScrollInfo={drawerScrollInfo.shop}
            />

            <DrawerPage
                name={"ETC"}
                show={etcOpen}
                gradientColors={["#5A28C7", "#6B36CE"]}
                content={<BannerInfo type={"etc"} />}
                drawerScrollHeight={"53.6rem"}
                drawerScrollInfo={drawerScrollInfo.etc}
            />

            <div
                style={{
                    position: "absolute",
                    transition: "right 0.2s",
                    right: homeOpen && showButtons ? 0 : "-36.45rem",
                    width: "36.45rem",
                    height: "8.33rem",
                    backgroundColor: "#4B93E8AA",
                    bottom: "1.11rem",
                    zIndex: 10,
                    display: "flex",
                    borderRadius: "0.5rem 0 0 0.5rem",
                }}
                onClick={() => handleDrawer("home")}
            >
                <img
                    src={resources["Icon: Drawer_HomeTriangle"]}
                    style={{
                        height: "2.78rem",
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}
                />
                <p
                    style={{
                        color: "#FFFFFF",
                        transform: "rotate(90deg)",
                        height: "2rem",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginRight: "-2.5rem",
                        fontSize: "1.5rem",
                    }}
                >
                    Home
                </p>
                <img src={resources["Icon: Home_Info"]} className="drawerHomeImg" />
                <img src={resources["Icon: Home_Gifts"]} className="drawerHomeImg" />
                <img src={resources["Icon: Home_MapInfo"]} className="drawerHomeImg" />
                <img src={resources["Icon: Home_WorldMap"]} className="drawerHomeImg" />
            </div>

            <DrawerButtons
                cardsOpen={cardsOpen}
                socialOpen={socialOpen}
                shopOpen={shopOpen}
                etcOpen={etcOpen}
                homeOpen={homeOpen}
                handleDrawer={handleDrawer}
                showButtons={showButtons}
            />
        </>
    );
}

export default Drawer;
