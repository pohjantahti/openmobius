import { Element } from "../../info/types";

interface Enemy {
    id: number;
    name: string;
    resources: {
        card: string;
        border: string;
    };
    element: Element;
    hp: number;
    breakGauge: {
        yellow: number;
        red: number;
    };
    attack: number;
    defense: number;
}

const enemies: Array<Enemy> = [
    {
        id: 0,
        name: "Shiva",
        resources: {
            card: "Card: Shiva: FFX 1",
            border: "Card: 5* Frame",
        },
        element: "water",
        hp: 50000,
        breakGauge: {
            yellow: 1000,
            red: 1000,
        },
        attack: 1000,
        defense: 5,
    },
    {
        id: 1,
        name: "Dust Soldier",
        resources: {
            card: "Card: Dust Soldier (Fire) 2*",
            border: "Card: 5* Frame",
        },
        element: "fire",
        hp: 10000,
        breakGauge: {
            yellow: 100,
            red: 100,
        },
        attack: 200,
        defense: 2,
    },
];

export default enemies;
export type { Enemy };
