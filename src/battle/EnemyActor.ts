import { Element, Target } from "../info/types";
import { Enemy } from "../data/game/enemies";
import { Ailment, Boon, Effect } from "./types";
import PlayerActor from "./PlayerActor";

class EnemyActor {
    id: number;
    name: string;
    resources: {
        card: string;
        border: string;
    };
    element: Element;
    hp: {
        current: number;
        max: number;
    };
    breakGauge: {
        yellow: {
            current: number;
            max: number;
        };
        red: {
            current: number;
            max: number;
        };
    };
    attack: number;
    defense: number;
    isBroken: boolean;
    isBrokenAnimation: boolean;
    breakLength: {
        current: number;
        max: number;
    };
    effects: Array<Effect>;

    constructor(data: Enemy) {
        this.id = data.id;
        this.name = data.name;
        this.resources = data.resources;
        this.element = data.element;
        this.hp = {
            current: data.hp,
            max: data.hp,
        };
        this.breakGauge = {
            yellow: {
                current: data.breakGauge.yellow,
                max: data.breakGauge.yellow,
            },
            red: {
                current: data.breakGauge.red,
                max: data.breakGauge.red,
            },
        };
        this.attack = data.attack;
        this.defense = data.defense;
        this.isBroken = false;
        this.isBrokenAnimation = false;
        this.breakLength = {
            current: 0,
            max: 7,
        };
        this.effects = [];
    }

    getHPDamage(player: PlayerActor) {
        // Job defense
        const defenseStat = player.getMainJob().stats.defense * 5;
        // Job Elemental Resistance
        const elementResistance = player.getMainJob().elementResistance[this.element];
        // Resist Element effect
        let resistedElement: Boon;
        switch (this.element) {
            case "fire":
                resistedElement = Boon.ResistFire;
                break;
            case "water":
                resistedElement = Boon.ResistWater;
                break;
            case "wind":
                resistedElement = Boon.ResistWind;
                break;
            case "earth":
                resistedElement = Boon.ResistEarth;
                break;
            case "light":
                resistedElement = Boon.ResistLight;
                break;
            case "dark":
                resistedElement = Boon.ResistDark;
                break;
        }
        let resistElement = 0;
        const resistEffect = player.effects.filter((effect) => effect.name === resistedElement)[0];
        if (resistEffect) {
            const resistPoints = resistEffect.resistancePoints!;
            if (resistPoints > 0 && resistPoints <= 3) {
                resistElement = 20;
            } else if (resistPoints > 3 && resistPoints <= 5) {
                resistElement = 35;
            } else if (resistPoints > 5 && resistPoints <= 10) {
                resistElement = 50;
            }
        }

        const defense = Math.min(
            (1 + defenseStat / -100) * (1 + elementResistance / -100) * (1 + resistElement / -100),
            1
        );
        return Math.floor(this.attack * defense);
    }

    takeDamage(damage: { hp: number; yellow: number; red: number }) {
        this.hp.current = Math.max(this.hp.current - damage.hp, 0);
        this.breakGauge.yellow.current = Math.max(
            this.breakGauge.yellow.current - damage.yellow,
            0
        );
        // Calculate the minimum amount of red gauge. Red can only be >= yellow
        const minRedGauge =
            (this.breakGauge.red.max * this.breakGauge.yellow.current) / this.breakGauge.yellow.max;
        this.breakGauge.red.current = Math.max(
            this.breakGauge.red.current - damage.red,
            minRedGauge
        );
        // Enemy is broken
        if (!this.isBroken && this.breakGauge.red.current === 0) {
            this.isBroken = true;
            this.isBrokenAnimation = true;
            this.breakLength.current = this.breakLength.max;
        }
    }

    // Add effect or reapply current effect with new duration
    addEffect(newEffect: {
        name: Boon | Ailment;
        duration: number;
        target: Target;
        timing?: "before" | "after";
        type?: "square" | "hexagon";
        resistancePoints?: number;
    }) {
        if (this.effectActive(newEffect.name)) {
            const currentEffect = this.effects.filter(
                (effect) => effect.name === newEffect.name
            )[0];
            currentEffect.duration = Math.min(
                Math.max(currentEffect.duration, newEffect.duration),
                5
            );
            if (currentEffect.type === "square" && newEffect.type === "hexagon") {
                currentEffect.type = "hexagon";
            }
            if (newEffect.resistancePoints && newEffect.resistancePoints >= 0) {
                currentEffect.resistancePoints = newEffect.resistancePoints;
            }
        } else {
            this.effects.push({
                name: newEffect.name,
                type: newEffect.type || "square",
                duration: Math.min(newEffect.duration, 5),
                resistancePoints: newEffect.resistancePoints,
            });
        }
    }

    effectActive(name: string): boolean {
        return this.effects.filter((effect) => effect.name === name).length > 0;
    }

    // Reduce effect durations and filter out the ones with a duration or resistancePoints of 0
    reduceEffects(amount = 1) {
        this.effects.forEach((effect) => {
            effect.duration -= amount;
            if (effect.resistancePoints) {
                effect.resistancePoints -= 2;
            }
        });
        this.effects = this.effects.filter(
            (effect) =>
                effect.duration > 0 || (effect.resistancePoints && effect.resistancePoints > 0)
        );
    }
}

export default EnemyActor;
