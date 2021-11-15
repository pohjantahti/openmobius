import { Card } from "../data/game/cards";
import { Job } from "../data/game/jobs";

type FullDeck = [Deck, Deck];

interface Deck {
    job: Job;
    cards: Array<Card | undefined>;
}

type Element = "fire" | "water" | "wind" | "earth" | "light" | "dark";
type CardElement = "fire" | "water" | "wind" | "earth" | "light" | "dark" | "life";
type JobClass = "warrior" | "ranger" | "mage" | "monk";
type CardClass = "warrior" | "ranger" | "mage" | "monk" | "support";

export type { FullDeck, Deck, Element, CardElement, JobClass, CardClass };
