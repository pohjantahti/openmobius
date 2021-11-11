import { CardType } from "../data/game/cards";
import { JobType } from "../data/game/jobs";

interface FullDeckType {
    decks: [DeckType, DeckType];
    activeDeck: number;
}

interface DeckType {
    job: JobType;
    cards: Array<CardType | undefined>;
}

export type { FullDeckType, DeckType };
