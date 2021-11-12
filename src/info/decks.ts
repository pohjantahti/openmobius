import { FullDeckType } from "./types";

let deckInfo: Array<FullDeckType> = [];
let currentDeck: number = 0;

const setDeckInfo = (decks: Array<FullDeckType>) => {
    deckInfo = decks;
};

const setCurrentDeck = (newCurrentDeck: number) => {
    currentDeck = newCurrentDeck;
};

export { deckInfo, currentDeck, setDeckInfo, setCurrentDeck };
