import { Ailment, AutoAbility, Boon, Effect, ExtraSkill, InnateSkill } from "../../battle/types";
import { CardClass, CardElement, Target } from "../../info/types";

interface Card {
    id: number;
    name: string;
    resources: {
        card: string;
        thumbnail: string;
    };
    class: CardClass;
    star: number;
    level: number;
    overboost: number;
    element: CardElement;
    ability: {
        name: string;
        cost: number;
        attack: number;
        break: number;
        critical: number;
        target: Target;
        hits: number;
        cooldown?: number;
    };
    extraSkills: Array<ExtraSkill>;
    autoAbilities: Partial<Record<AutoAbility, number>>;
    innateSkills?: Partial<Record<InnateSkill, number>>;
    effect?: Array<Effect>;
}

const cards: Array<Card> = [
    {
        id: 0,
        name: "Ares",
        resources: {
            card: "Card: Ares",
            thumbnail: "Thumbnail: Ares",
        },
        class: "warrior",
        star: 5,
        level: 80,
        overboost: 0,
        element: "fire",
        ability: {
            name: "Flame Sword",
            cost: 3,
            attack: 660,
            break: 540,
            critical: 1,
            target: "single",
            hits: 1,
        },
        extraSkills: [
            ExtraSkill.Bloodthirst,
            ExtraSkill.ElementalRetrieval,
            ExtraSkill.GuardBreaker,
            ExtraSkill.DamageLimitBreak,
            ExtraSkill.ElementalMirror,
            ExtraSkill.VitalityTap,
        ],
        autoAbilities: {
            attackUp: 3,
            enhanceFire: 3,
        },
    },
    {
        id: 1,
        name: "Jormungand",
        resources: {
            card: "Card: Jormungand",
            thumbnail: "Thumbnail: Jormungand",
        },
        class: "warrior",
        star: 5,
        level: 80,
        overboost: 0,
        element: "earth",
        ability: {
            name: "Earth Burst",
            cost: 4,
            attack: 720,
            break: 360,
            critical: 1,
            target: "area",
            hits: 1,
        },
        extraSkills: [
            ExtraSkill.Bloodthirst,
            ExtraSkill.ElementalRetrieval,
            ExtraSkill.GuardBreaker,
            ExtraSkill.DamageLimitBreak,
            ExtraSkill.ElementalMirror,
            ExtraSkill.VitalityTap,
        ],
        autoAbilities: {
            attackUp: 3,
            enhanceEarth: 3,
        },
    },
    {
        id: 2,
        name: "Knights of the Round: FFVII",
        resources: {
            card: "Card: Knights of the Round: FFVII",
            thumbnail: "Thumbnail: Knights of the Round: FFVII",
        },
        class: "support",
        star: 5,
        level: 80,
        overboost: 0,
        element: "life",
        ability: {
            name: "Ultimate Boon",
            cost: 3,
            attack: 0,
            break: 0,
            critical: 0,
            target: "self",
            hits: 0,
            cooldown: 3,
        },
        extraSkills: [
            ExtraSkill.EnhancedLife,
            ExtraSkill.LastingBoons,
            ExtraSkill.QuickCast,
            ExtraSkill.EnhancedBoons,
            ExtraSkill.ExtraLife,
            ExtraSkill.DurationBoost,
        ],
        autoAbilities: {
            enhanceLight: 3,
            enhanceDark: 3,
        },
        effect: [
            {
                name: Boon.Faith,
                duration: 3,
                target: "self",
                timing: "before",
            },
            {
                name: Boon.Boost,
                duration: 3,
                target: "self",
                timing: "before",
            },
            {
                name: Boon.Brave,
                duration: 3,
                target: "self",
                timing: "before",
            },
        ],
    },
    {
        id: 3,
        name: "Xezat: FFV",
        resources: {
            card: "Card: Xezat: FFV",
            thumbnail: "Thumbnail: Xezat: FFV",
        },
        class: "warrior",
        star: 5,
        level: 80,
        overboost: 0,
        element: "water",
        ability: {
            name: "Spellsword Strafe",
            cost: 3,
            attack: 1980,
            break: 3000,
            critical: 1,
            target: "single",
            hits: 16,
        },
        extraSkills: [
            ExtraSkill.ExtremeBloodthirst,
            ExtraSkill.BreakerKiller,
            ExtraSkill.ElementalRetrieval,
            ExtraSkill.GuardBreaker,
            ExtraSkill.DamageLimitBreak,
            ExtraSkill.BreakExploiter,
            ExtraSkill.VitalityTap,
        ],
        autoAbilities: {
            piercingBreak: 30,
            magicUp: 8,
        },
        effect: [
            {
                name: Ailment.BreakDefenseDown,
                duration: 3,
                target: "single",
                timing: "before",
                type: "hexagon",
            },
        ],
    },
];

export default cards;
export type { Card };
