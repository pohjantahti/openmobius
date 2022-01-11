import { BattleAction } from "../../../battle/types";
import { Card } from "../../../data/game/cards";
import { resources } from "../../../extractor";
import { CardElement } from "../../../info/types";
import { capitalize } from "../../../utils";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number | undefined) => void;
    show: boolean;
    cardInfo: Card | undefined;
    index: number;
    style: React.CSSProperties;
}

function CardButton(props: Props) {
    const { handleBattleAction, show, cardInfo, index, style } = props;

    const elementColor: Record<CardElement, string> = {
        fire: "#DF0909",
        water: "#03CED2",
        wind: "#00D200",
        earth: "#CFD205",
        light: "#CFD47A",
        dark: "#5A03CC",
        life: "#CD00D0",
    };

    return (
        <div
            style={{
                ...style,
                position: "absolute",
                height: "11rem",
                width: "11rem",
                right: show && cardInfo ? 0 : "-7.3rem",
                transition: "right 0.3s linear",
            }}
        >
            <img
                src={resources["Icon: Battle_CardBackground_Top"]}
                style={{
                    position: "absolute",
                    top: "-0.2rem",
                    right: "-1rem",
                    width: "11rem",
                }}
            />
            <img
                src={resources["Icon: Battle_CardBackground_Bottom"]}
                style={{
                    position: "absolute",
                    bottom: "-0.1rem",
                    right: "-0.5rem",
                    width: "11rem",
                }}
            />
            {/* Card thumbnail and border */}
            <div
                style={{
                    position: "absolute",
                    height: "8.75rem",
                    width: "8.75rem",
                    marginTop: "1.125rem",
                    right: 0,
                    backgroundColor: "black",
                }}
            >
                {cardInfo && (
                    <>
                        <img
                            src={resources[cardInfo.resources.thumbnail]}
                            style={{
                                position: "absolute",
                                height: "inherit",
                                borderRadius: "0.8rem",
                            }}
                        />
                        <img
                            src={resources["Icon: CardThumbnail_Decoration5*"]}
                            style={{
                                position: "absolute",
                                height: "inherit",
                                filter: `url(#${cardInfo.element}Filter)`,
                            }}
                        />
                    </>
                )}
            </div>
            <img
                src={resources["Icon: Battle_CardElementCostBackground"]}
                style={{
                    height: "11rem",
                    position: "absolute",
                }}
            />
            {/* Elemet orb */}
            <img
                src={resources[`Icon: ${cardInfo ? capitalize(cardInfo.element) : "Null"}Orb`]}
                style={{
                    position: "absolute",
                    height: "2.8rem",
                    marginTop: "0.9rem",
                    marginLeft: "0.7rem",
                }}
            />
            {/* Orb cost */}
            {cardInfo && (
                <div
                    style={{
                        position: "absolute",
                        height: "5.5rem",
                        width: "0.9rem",
                        marginTop: "4.2rem",
                        marginLeft: "1.3rem",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {Array(cardInfo.ability.cost)
                        .fill(undefined)
                        .map((x, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: elementColor[cardInfo.element],
                                    width: "100%",
                                    height: "100%",
                                    marginBottom: "0.4rem",
                                }}
                            />
                        ))}
                </div>
            )}
            {/* Ability name */}
            <div
                style={{
                    position: "absolute",
                    marginTop: "7.5rem",
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                }}
            >
                <p
                    style={{
                        color: "#FFFFDD",
                        textShadow: "-1px 0 #5A4913, 0 1px #5A4913, 1px 0 #5A4913, 0 -1px #5A4913",
                        fontSize: "1.5rem",
                        display: show ? "inline" : "none",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                    }}
                >
                    {cardInfo?.ability.name}
                </p>
                {cardInfo?.ability.target === "area" && (
                    <img
                        src={resources["Icon: Battle_AreaIcon"]}
                        style={{
                            height: "2rem",
                            marginTop: "0.5rem",
                        }}
                    />
                )}
            </div>
            {/* Clickable area */}
            <div
                style={{
                    position: "absolute",
                    width: "10.5rem",
                    height: "10.4rem",
                    top: "0.2rem",
                    right: 0,
                    zIndex: 1,
                }}
                onClick={
                    show && cardInfo ? () => handleBattleAction(BattleAction.Card, index) : () => {}
                }
            />
        </div>
    );
}

export default CardButton;
