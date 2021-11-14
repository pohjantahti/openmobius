import { Card } from "../data/game/cards";
import { Job } from "../data/game/jobs";

interface FullDeck {
    decks: [Deck, Deck];
    activeDeck: number;
}

interface Deck {
    job: Job;
    cards: Array<Card | undefined>;
}

export type { FullDeck, Deck };
