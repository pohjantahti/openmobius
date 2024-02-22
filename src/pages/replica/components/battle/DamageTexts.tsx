import { useEffect } from "react";
import { sleep } from "@utils";
import DamageTextNumber from "./DamageTextNumber";

interface Props {
    damageHits?: Array<{
        damage: number;
        critical?: boolean;
        weakness?: boolean;
        broken?: boolean;
    }>;
    divName: string;
    healHits?: Array<number>;
    poisonHits?: Array<number>;
}

function DamageTexts(props: Props) {
    const { damageHits, divName, healHits, poisonHits } = props;
    const centerOffset = () => {
        return Math.random() * 5;
    };

    const setAnimation = async (name: string, type: "damage" | "heal" | "poison") => {
        let maxTime = 800;
        const hitDivs: NodeListOf<HTMLElement> = document.querySelectorAll(`.${name}${type}`);
        for (let i = 0; i < hitDivs.length; i++) {
            hitDivs[i].style.opacity = "1";
            const time = Math.min(maxTime / hitDivs.length, 100);
            maxTime -= time;
            await sleep(time);
        }
        for (let i = 0; i < hitDivs.length; i++) {
            await sleep(Math.min(maxTime / hitDivs.length, 500));
            hitDivs[i].style.opacity = "0";
        }
    };

    useEffect(() => {
        setAnimation(divName, "damage");
    }, [damageHits, divName]);

    useEffect(() => {
        setAnimation(divName, "heal");
    }, [healHits, divName]);

    useEffect(() => {
        setAnimation(divName, "poison");
    }, [poisonHits, divName]);

    return (
        <>
            {damageHits?.map((hit, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: `${5 + centerOffset()}rem`,
                        left: `${-10 + centerOffset()}rem`,
                        display: "flex",
                        opacity: 0,
                        transition: "opacity 0.2s linear",
                    }}
                    className={divName + "damage"}
                >
                    <DamageTextNumber
                        damage={hit.damage}
                        filter={hit.broken ? "url(#brokenDamageTextFilter)" : "none"}
                    />
                    {(hit.critical || hit.weakness) && (
                        <div
                            style={{
                                position: "absolute",
                                top: "-4rem",
                                height: "5rem",
                                width: "10rem",
                                display: "flex",
                                flexDirection: "column-reverse",
                            }}
                        >
                            {hit.critical && (
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "2.8rem",
                                        fontWeight: "lighter",
                                        fontFamily: "Cinema",
                                        filter: "url(#thinBlackOutlineFilter)",
                                        marginTop: "-0.5rem",
                                    }}
                                >
                                    CRITICAL
                                </p>
                            )}
                            {hit.weakness && (
                                <p
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: "2.8rem",
                                        fontWeight: "lighter",
                                        fontFamily: "Cinema",
                                        filter: "url(#thinBlackOutlineFilter)",
                                        marginTop: "-0.5rem",
                                    }}
                                >
                                    WEAKNESS
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {healHits?.map((heal, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: `${5 + centerOffset()}rem`,
                        left: `${-10 + centerOffset()}rem`,
                        display: "flex",
                        opacity: 0,
                        transition: "opacity 0.2s linear",
                    }}
                    className={divName + "heal"}
                >
                    <DamageTextNumber damage={heal} filter={"url(#healTextFilter)"} />
                </div>
            ))}
            {poisonHits?.map((poison, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: `${5 + centerOffset()}rem`,
                        left: `${-10 + centerOffset()}rem`,
                        display: "flex",
                        opacity: 0,
                        transition: "opacity 0.2s linear",
                    }}
                    className={divName + "poison"}
                >
                    <DamageTextNumber damage={poison} filter={"url(#poisonTextFilter)"} />
                </div>
            ))}
        </>
    );
}
export default DamageTexts;
