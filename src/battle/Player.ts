import { Deck, FullDeck } from "../info/types";

interface PlayerInput {
    deck: FullDeck;
}

class Player {
    deck: FullDeck;
    activeDeck: 0 | 1;

    wheel: [number, number, number];

    constructor(data: PlayerInput) {
        this.deck = data.deck;
        this.activeDeck = 0;
        this.wheel = [100 / 3, 100 / 3, 100 / 3];
    }

    // Main refers to the current active job/deck
    getMainJob(): Deck {
        return this.deck[this.activeDeck];
    }

    // Sub refers to the current non-active job/deck
    getSubJob(): Deck {
        return this.deck[this.activeDeck === 0 ? 1 : 0];
    }
}

export default Player;
