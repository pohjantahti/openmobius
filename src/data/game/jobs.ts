import { AutoAbility } from "../../battle/types";
import { Element, JobClass } from "../../info/types";

interface Job {
    id: number;
    name: string;
    resources: {
        card: string;
        thumbnail: string;
    };
    class: JobClass;
    level: number;
    overboost: number;
    elements: [Element, Element, Element];
    stats: {
        hp: number;
        attack: number;
        break: number;
        magic: number;
        critical: number;
        speed: number;
        defense: number;
    };
    elementEnhance: Partial<Record<Element, number>>;
    elementResistance: Partial<Record<Element, number>>;
    autoAbilities: Partial<Record<AutoAbility, number>>;
}

const jobs: Array<Job> = [
    {
        id: 0,
        name: "Warrior",
        resources: {
            card: "Card: Warrior",
            thumbnail: "Thumbnail: Warrior",
        },
        class: "warrior",
        level: 8,
        overboost: 0,
        elements: ["fire", "water", "earth"],
        stats: {
            hp: 9230,
            attack: 675,
            break: 407,
            magic: 335,
            critical: 2,
            speed: 6,
            defense: 2,
        },
        elementEnhance: {
            fire: 150,
        },
        elementResistance: {
            fire: 45,
        },
        autoAbilities: {
            avertAttackDown: 50,
            avertDefenseDown: 50,
        },
    },
];

export default jobs;
export type { Job };
