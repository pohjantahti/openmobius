import { FullDeck } from "./types";

let deckInfo: Array<FullDeck> = [];
let currentDeck: number = 0;

const setDeckInfo = (decks: Array<FullDeck>) => {
    deckInfo = decks;
};

const setCurrentDeck = (newCurrentDeck: number) => {
    currentDeck = newCurrentDeck;
};

const getCurrentDeckLevel = (subJob?: boolean) => {
    const deck = deckInfo[currentDeck][subJob ? 1 : 0];
    return (
        deck.job.overboost +
        (deck.cards[0]?.level || 0) +
        (deck.cards[0]?.overboost || 0) +
        (deck.cards[1]?.level || 0) +
        (deck.cards[1]?.overboost || 0) +
        (deck.cards[2]?.level || 0) +
        (deck.cards[2]?.overboost || 0) +
        (deck.cards[3]?.level || 0) +
        (deck.cards[3]?.overboost || 0)
    );
};

const getCurrentDeckName = (subJob?: boolean) => {
    const deck = deckInfo[currentDeck][subJob ? 1 : 0];
    return deck.job.name;
};

const getCurrentDeckElements = (subJob?: boolean) => {
    const deck = deckInfo[currentDeck][subJob ? 1 : 0];
    return deck.job.elements;
};

export {
    deckInfo,
    currentDeck,
    setDeckInfo,
    setCurrentDeck,
    getCurrentDeckLevel,
    getCurrentDeckName,
    getCurrentDeckElements,
};
