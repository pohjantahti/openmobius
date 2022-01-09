import { PlayerInput } from "../PlayerActor";
import { Card } from "../../data/game/cards";
import { Enemy } from "../../data/game/enemies";

const emptyPlayerActor: PlayerInput = {
    deck: [
        {
            job: {
                id: 0,
                name: "",
                resources: { card: "", thumbnail: "" },
                class: "warrior",
                level: 8,
                overboost: 0,
                elements: ["fire", "water", "earth"],
                stats: {
                    hp: 0,
                    attack: 0,
                    breakPower: 0,
                    magic: 0,
                    critical: 0,
                    speed: 0,
                    defense: 0,
                },
                elementEnhance: {},
                elementResistance: {},
                autoAbilities: {},
                ultimate: {
                    name: "",
                    attack: 0,
                    breakPower: 0,
                    critical: 0,
                    target: "single",
                    hits: 0,
                    level: 1,
                    effect: [],
                },
            },
            cards: [undefined, undefined, undefined, undefined],
        },
        {
            job: {
                id: 0,
                name: "",
                resources: { card: "", thumbnail: "" },
                class: "warrior",
                level: 8,
                overboost: 0,
                elements: ["fire", "water", "earth"],
                stats: {
                    hp: 0,
                    attack: 0,
                    breakPower: 0,
                    magic: 0,
                    critical: 0,
                    speed: 0,
                    defense: 0,
                },
                elementEnhance: {},
                elementResistance: {},
                autoAbilities: {},
                ultimate: {
                    name: "",
                    attack: 0,
                    breakPower: 0,
                    critical: 0,
                    target: "single",
                    hits: 0,
                    level: 1,
                    effect: [],
                },
            },
            cards: [undefined, undefined, undefined, undefined],
        },
    ],
    ultimate: 100,
    activeDeck: 0,
};

const emptyCard: Card = {
    id: 0,
    name: "",
    resources: { card: "", thumbnail: "" },
    class: "warrior",
    star: 5,
    level: 80,
    overboost: 0,
    element: "fire",
    ability: {
        name: "",
        cost: 0,
        attack: 0,
        break: 0,
        critical: 0,
        target: "single",
        hits: 1,
    },
    extraSkills: [],
    autoAbilities: {},
    innateSkills: {},
};

const emptyEnemyActor: Enemy = {
    id: 0,
    name: "",
    resources: { card: "", border: "" },
    element: "water",
    hp: 0,
    breakGauge: {
        yellow: 0,
        red: 0,
    },
    attack: 0,
    defense: 0,
};

test.todo("Battle features");

export { emptyPlayerActor, emptyCard, emptyEnemyActor };
