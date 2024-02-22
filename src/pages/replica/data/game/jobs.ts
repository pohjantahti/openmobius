import { AutoAbility, Boon, Effect } from "../../battle/types";
import { Element, JobClass, Target } from "../../info/types";

interface Job {
    id: number;
    name: string;
    resources: {
        card: string;
        thumbnail: string;
        music: string;
    };
    class: JobClass;
    level: number;
    overboost: number;
    elements: [Element, Element, Element];
    stats: {
        hp: number;
        attack: number;
        breakPower: number;
        magic: number;
        critical: number;
        speed: number;
        defense: number;
    };
    elementEnhance: Partial<Record<Element, number>>;
    elementResistance: Partial<Record<Element, number>>;
    autoAbilities: Partial<Record<AutoAbility, number>>;
    ultimate: {
        name: string;
        attack: number;
        breakPower: number;
        critical: number;
        target: Target;
        hits: number;
        level: number;
        lastHitAttack?: number;
        lastHitBreakPower?: number;
        lastHitTarget?: Target;
        effect?: Array<Effect>;
    };
}

const jobs: Array<Job> = [
    {
        id: 0,
        name: "Warrior",
        resources: {
            card: "Card: Warrior",
            thumbnail: "Thumbnail: Warrior",
            music: "Music: Warrior",
        },
        class: "warrior",
        level: 8,
        overboost: 0,
        elements: ["fire", "water", "earth"],
        stats: {
            hp: 9230,
            attack: 675,
            breakPower: 407,
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
        ultimate: {
            name: "Arc Slash",
            attack: 2000,
            breakPower: 700,
            critical: 1,
            target: "cone",
            hits: 4,
            level: 9,
            effect: [
                {
                    name: Boon.Brave,
                    duration: 4,
                    target: "self",
                    timing: "after",
                    type: "hexagon",
                },
            ],
        },
    },
];

export default jobs;
export type { Job };
