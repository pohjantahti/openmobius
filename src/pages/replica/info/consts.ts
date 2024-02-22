import { Ailment, Boon } from "../battle/types";
import { Element } from "../info/types";

const MAX = {
    deckCount: 10,
    cardLevel: 80,
    cardOverboost: 8,
    jobOverboost: 32,
    ultimateLevel: 10,
    effectDuration: 5,
    orbCount: 16,
};

const elementforces: Partial<Record<Boon | Ailment, Element>> = {
    flameforce: "fire",
    iceforce: "water",
    windforce: "wind",
    earthforce: "earth",
    lightforce: "light",
    darkforce: "dark",
};

export { MAX, elementforces };
