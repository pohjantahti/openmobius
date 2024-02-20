import React from "react";
import { resources } from "../../extractor";

interface DrawerItem {
    name: string;
    nameSize?: string;
    img: string;
    link: string;
    alert?: number;
    text?: string;
    textSize?: string;
}

function DrawerScrollList(props: { items: Array<DrawerItem> }) {
    const { items } = props;

    const scrollList: Array<React.ReactNode> = [];

    items.forEach((item: DrawerItem, index: number) => {
        scrollList.push(
            <React.Fragment key={index}>
                {index > 0 && <div style={{ border: "1px solid #FFFFFFEE" }} />}
                {/* TODO: Add linking */}
                <div
                    style={{
                        display: "flex",
                        marginBottom: "1rem",
                        marginTop: index > 0 ? "1.2rem" : "1.8rem",
                    }}
                >
                    {item.alert && (
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                display: "flex",
                            }}
                        >
                            <img
                                src={resources["Icon: Drawer_AlertBackground"]}
                                style={{
                                    height: "3.2rem",
                                    filter: "url(#alertFilter)",
                                    marginLeft: "3.4rem",
                                    marginTop: "-0.1rem",
                                }}
                            />
                            <img
                                src={resources["Icon: Drawer_AlertBorder"]}
                                style={{
                                    height: "3.5rem",
                                    marginLeft: "-3.4rem",
                                    marginTop: "-0.3rem",
                                    zIndex: 1,
                                }}
                            />
                            <p
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: "1.8rem",
                                    marginLeft:
                                        item.alert?.toString().length === 2 ? "-3.1rem" : "-2.4rem",
                                    marginTop: "-0.4rem",
                                    zIndex: 1,
                                }}
                            >
                                {item.alert}
                            </p>
                        </div>
                    )}
                    <img src={resources[item.img]} style={{ height: "6.67rem" }} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "34.67rem",
                        }}
                    >
                        <p
                            style={{
                                color: "#FFFFFFDD",
                                fontSize: item.nameSize ? item.nameSize : "2.6rem",
                                marginTop: "0.5rem",
                                marginLeft: "0.53rem",
                            }}
                        >
                            {item.name}
                        </p>
                        {/* Display the small text in the bottom left on certain items */}
                        {item.text && item.name !== "Skill Draw" && (
                            <p
                                style={{
                                    color: "#FFFFFFDD",
                                    fontSize: item.textSize ? item.textSize : "1.6rem",
                                    marginTop: "0.5rem",
                                    lineHeight: 0,
                                    textAlign: "end",
                                }}
                            >
                                {item.text}
                            </p>
                        )}
                        {/* Display amount of medals(?) in Skill Draw  */}
                        {item.text && item.name === "Skill Draw" && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <img
                                    src={resources["Icon: SkillDraw3*_Small"]}
                                    style={{
                                        height: "2rem",
                                        marginBottom: "-10rem",
                                        marginTop: "-0.5rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFFDD",
                                        fontSize: item.textSize ? item.textSize : "1.6rem",
                                        marginTop: "0.5rem",
                                        lineHeight: 0,
                                        textAlign: "end",
                                    }}
                                >
                                    {item.text?.split(",")[0]}
                                </p>
                                <img
                                    src={resources["Icon: SkillDraw2*_Small"]}
                                    style={{
                                        height: "2rem",
                                        marginBottom: "-10rem",
                                        marginTop: "-0.5rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFFDD",
                                        fontSize: item.textSize ? item.textSize : "1.6rem",
                                        marginTop: "0.5rem",
                                        lineHeight: 0,
                                        textAlign: "end",
                                    }}
                                >
                                    {item.text?.split(",")[1]}
                                </p>
                                <img
                                    src={resources["Icon: SkillDraw1*_Small"]}
                                    style={{
                                        height: "2rem",
                                        marginBottom: "-10rem",
                                        marginTop: "-0.5rem",
                                    }}
                                />
                                <p
                                    style={{
                                        color: "#FFFFFFDD",
                                        fontSize: item.textSize ? item.textSize : "1.6rem",
                                        marginTop: "0.5rem",
                                        lineHeight: 0,
                                        textAlign: "end",
                                    }}
                                >
                                    {item.text?.split(",")[2]}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                {index === items.length - 1 && (
                    <div
                        style={{
                            border: "1px solid #FFFFFF88",
                            marginBottom: "3rem",
                        }}
                    />
                )}
            </React.Fragment>
        );
    });
    return scrollList;
}

export default DrawerScrollList;
export type { DrawerItem };
