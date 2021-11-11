import { MAX } from "./consts";
import { getGameData } from "../extractor";
import { setDeckInfo } from "./decks";
import { FullDeckType } from "./types";

const defaultLocalStorageContent: {
    decks: Array<Array<{ job: number; cards: Array<number> }>>;
} = {
    decks: [
        [
            {
                job: 0,
                cards: [0, 1, 2, 3],
            },
            {
                job: 0,
                cards: [-1, 0, 0, -1],
            },
        ],
    ],
};

const initLocalStorage = async () => {
    const localStorage = window.localStorage;
    localStorage.clear();

    // Set default deck data to localStorage if it doesnt exist
    if (localStorage.length === 0 || !localStorage.getItem("decks")) {
        console.log("Local Storage filled with default data");
        localStorage.setItem("decks", JSON.stringify(defaultLocalStorageContent.decks));
    }

    // Get localStorage data and add it to deckInfo
    const deckData: Array<any> = JSON.parse(localStorage.getItem("decks")!);
    const decks: Array<FullDeckType> = [];
    // Loop through full decks (main + sub)
    for (let i = 0; i < Math.min(deckData.length, MAX.deckCount); i++) {
        const deck: any = [];
        // Loop through main and sub decks
        for (let j = 0; j < 2; j++) {
            const halfDeck = deckData[i][j];
            // Get job data. If provided id doesn't return anything, use 0
            let job = await getGameData("Job", halfDeck.job);
            if (job === undefined) {
                job = await getGameData("Job", 0);
            }
            const cards = Array(4).fill(undefined);
            // Loop through subDeck cards
            for (let k = 0; k < cards.length; k++) {
                const cardId: number = halfDeck.cards[k];
                // Negative cardId is an empty slot.
                // getGameData returning undefined when cardId is incorrect is also an empty slot.
                if (cardId >= 0) {
                    cards[k] = await getGameData("Card", cardId);
                }
            }
            deck.push({
                job: job,
                cards: cards,
            });
        }
        decks.push({
            decks: deck,
            activeDeck: 0,
        });
    }
    setDeckInfo(decks);
};

export { initLocalStorage };
