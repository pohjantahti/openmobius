import { FullDeckType } from "./types";

let deckInfo: Array<FullDeckType> = [];

const setDeckInfo = (decks: Array<FullDeckType>) => {
    deckInfo = decks;
};

export { deckInfo, setDeckInfo };
