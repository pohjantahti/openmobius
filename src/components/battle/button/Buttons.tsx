import ClickButtons from "./ClickButtons";
import DragButtons from "./DragButtons";
import { Element, FullElement } from "../../../info/types";
import CardButtons from "./CardButtons";
import { BattleAction, BattleCard } from "../../../battle/types";

interface Props {
    handleBattleAction: (action: BattleAction, index?: number) => void;
    elements: [Element, Element, Element];
    orbs: Record<FullElement, number>;
    ultimate: {
        gauge: {
            current: number;
            max: number;
        };
        name: string;
    };
    showCards: Array<boolean>;
    cards: Array<BattleCard | undefined>;
    countdownToJobChange: number;
    changingTarget: boolean;
}

function Buttons(props: Props) {
    const {
        handleBattleAction,
        elements,
        orbs,
        ultimate,
        showCards,
        cards,
        countdownToJobChange,
        changingTarget,
    } = props;
    return (
        <>
            <ClickButtons handleBattleAction={handleBattleAction} changingTarget={changingTarget} />
            <DragButtons
                handleBattleAction={handleBattleAction}
                elements={elements}
                orbs={orbs}
                ultimate={ultimate}
                countdownToJobChange={countdownToJobChange}
            />
            <CardButtons
                handleBattleAction={handleBattleAction}
                showCards={showCards}
                cards={cards}
                orbs={orbs}
            />
        </>
    );
}

export default Buttons;
