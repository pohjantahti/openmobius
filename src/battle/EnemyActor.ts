import { Element } from "../info/types";
import { Enemy } from "../data/game/enemies";
import { Boon } from "./types";
import PlayerActor from "./PlayerActor";
import BattleActor from "./BattleActor";

class EnemyActor extends BattleActor {
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

    constructor(data: Enemy, difficulty: number) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.resources = data.resources;
        this.element = data.element;
        this.hp = {
            current: data.hp * difficulty,
            max: data.hp * difficulty,
        };
        this.breakGauge = {
            yellow: {
                current: data.breakGauge.yellow * difficulty,
                max: data.breakGauge.yellow * difficulty,
            },
            red: {
                current: data.breakGauge.red * difficulty,
                max: data.breakGauge.red * difficulty,
            },
        };
        this.attack = data.attack * difficulty;
        this.defense = data.defense;
        this.isBroken = false;
        this.isBrokenAnimation = false;
        this.breakLength = {
            current: 0,
            max: 7,
        };
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
}

export default EnemyActor;
