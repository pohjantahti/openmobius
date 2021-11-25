import { BattleAction } from "../../../battle/types";
import { Card } from "../../../data/game/cards";
import CardButton from "./CardButton";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number) => void;
    showCards: Array<boolean>;
    cards: Array<Card | undefined>;
}

function CardButtons(props: Props) {
    const { handleBattleAction, showCards, cards } = props;

    return (
        <>
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[0]}
                cardInfo={cards[0]}
                index={0}
                style={{ top: "25.7rem" }}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[1]}
                cardInfo={cards[1]}
                index={1}
                style={{ top: "36.3rem" }}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[2]}
                cardInfo={cards[2]}
                index={2}
                style={{ top: "46.9rem" }}
            />
            <CardButton
                handleBattleAction={handleBattleAction}
                show={showCards[3]}
                cardInfo={cards[3]}
                index={3}
                style={{ top: "57.5rem" }}
            />
        </>
    );
}

export default CardButtons;
