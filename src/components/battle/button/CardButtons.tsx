import { BattleAction, BattleCard } from "../../../battle/types";
import { FullElement } from "../../../info/types";
import CardButton from "./CardButton";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number) => void;
    showCards: Array<boolean>;
    cards: Array<BattleCard | undefined>;
    orbs: Record<FullElement, number>;
}

function CardButtons(props: Props) {
    const { handleBattleAction, showCards, cards, orbs } = props;

    return (
        <>
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[0]}
                cardInfo={cards[0]}
                index={0}
                style={{ top: "25.7rem" }}
                orbs={orbs}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[1]}
                cardInfo={cards[1]}
                index={1}
                style={{ top: "36.3rem" }}
                orbs={orbs}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[2]}
                cardInfo={cards[2]}
                index={2}
                style={{ top: "46.9rem" }}
                orbs={orbs}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[3]}
                cardInfo={cards[3]}
                index={3}
                style={{ top: "57.5rem" }}
                orbs={orbs}
            />
        </>
    );
}

export default CardButtons;
