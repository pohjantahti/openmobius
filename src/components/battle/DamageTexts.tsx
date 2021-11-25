import { useEffect } from "react";
import { sleep } from "../../utils";
import DamageTextNumber from "./DamageTextNumber";

interface Props {
    damageHits?: Array<{
        damage: number;
        critical?: boolean;
        weakness?: boolean;
        broken?: boolean;
    }>;
    divName: string;
}

function DamageTexts(props: Props) {
    const { damageHits, divName } = props;
    const centerOffset = () => {
        return Math.random() * 5;
    };

    useEffect(() => {
        const setAnimation = async () => {
            let maxTime = 800;
            const damageHitDivs: NodeListOf<HTMLElement> = document.querySelectorAll(`.${divName}`);
            for (let i = 0; i < damageHitDivs.length; i++) {
                damageHitDivs[i].style.opacity = "1";
                const time = Math.min(maxTime / damageHitDivs.length, 100);
                maxTime -= time;
                await sleep(time);
            }
            for (let i = 0; i < damageHitDivs.length; i++) {
                await sleep(Math.min(maxTime / damageHitDivs.length, 500));
                damageHitDivs[i].style.opacity = "0";
            }
        };
        setAnimation();
    }, [damageHits, divName]);

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
                    className={divName}
                >
                    <DamageTextNumber damage={hit.damage} broken={Boolean(hit.broken)} />
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
        </>
    );
}
export default DamageTexts;
