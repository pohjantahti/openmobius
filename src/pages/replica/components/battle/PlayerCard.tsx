import { resources } from "../../extractor";
import DamageTexts from "./DamageTexts";

interface Props {
    battleResources: Record<string, string>;
    playerCard: string;
    damageToPlayer: Array<{
        damage: number;
    }>;
    playerMoving: boolean;
    healToPlayer: Array<number>;
    poisonToPlayer: Array<number>;
}

function PlayerCard(props: Props) {
    const {
        battleResources,
        playerCard,
        damageToPlayer,
        playerMoving,
        healToPlayer,
        poisonToPlayer,
    } = props;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    bottom: playerMoving ? "35rem" : "30rem",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "bottom 0.2s linear",
                }}
            >
                {/* Image and border */}
                <div
                    style={{
                        position: "relative",
                        width: "18rem",
                    }}
                >
                    <img
                        src={battleResources[playerCard]}
                        style={{
                            position: "absolute",
                            width: "100%",
                            marginTop: "8%",
                        }}
                    />
                    <img
                        src={resources["Card: 5-8* Frame"]}
                        style={{
                            position: "absolute",
                            width: "100%",
                        }}
                    />
                    <DamageTexts
                        damageHits={damageToPlayer}
                        divName={"playerDamageTextDiv"}
                        healHits={healToPlayer}
                        poisonHits={poisonToPlayer}
                    />
                </div>
            </div>
        </>
    );
}

export default PlayerCard;
