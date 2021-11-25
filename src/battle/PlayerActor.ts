import { Card } from "../data/game/cards";
import { Element, FullDeck, FullElement, Target } from "../info/types";
import EnemyActor from "./EnemyActor";
import PlayerDamage from "./PlayerDamage";
import { Ailment, BattleFullDeck, BattleJob, Boon, Effect, ExtraSkill } from "./types";
import { createBattleFullDeck, getStartingOrbs, isResistant } from "./utils";

interface PlayerInput {
    deck: FullDeck;
    ultimate: number;
}

class PlayerActor {
    deck: BattleFullDeck;
    activeDeck: 0 | 1;
    wheel: [number, number, number];
    ultimate: {
        current: number;
        max: number;
    };
    sameJob: boolean;
    countdownToJobChange: number;
    orbs: {
        fire: number;
        water: number;
        wind: number;
        earth: number;
        light: number;
        dark: number;
        life: number;
        prismatic: number;
    };
    actions: number;
    effects: Array<Effect>;

    constructor(data: PlayerInput) {
        this.deck = createBattleFullDeck(data.deck);
        this.activeDeck = 0;
        this.wheel = [100 / 3, 100 / 3, 100 / 3];
        this.ultimate = {
            current: data.ultimate,
            max: 100,
        };
        this.sameJob = this.getMainJob().id === this.getSubJob().id;
        this.countdownToJobChange = 4;
        this.orbs = getStartingOrbs(this.getMainJob().elements, 16);
        this.actions = this.getMainJob().stats.speed;
        this.effects = [];
    }

    // Main refers to the current active job
    getMainJob(): BattleJob {
        return this.deck[this.activeDeck].job;
    }

    // Sub refers to the current non-active job
    // If main and sub job are the same, returns the main job
    getSubJob(): BattleJob {
        return this.deck[this.sameJob ? this.activeDeck : this.activeDeck === 0 ? 1 : 0].job;
    }

    // Main refers to the current active job
    getMainCards(): Array<Card | undefined> {
        return this.deck[this.activeDeck].cards;
    }

    // Sub refers to the current non-active job
    getSubCards(): Array<Card | undefined> {
        return this.deck[this.activeDeck === 0 ? 1 : 0].cards;
    }

    changeJob() {
        this.activeDeck = this.activeDeck ? 0 : 1;
        this.countdownToJobChange = 4;
        this.actions = Math.max(this.actions - 1, 0);
    }

    resetActions() {
        this.actions = this.getMainJob().stats.speed;
    }

    updateOrbs(element: FullElement, amount: number) {
        if (amount < 0) {
            this.orbs[element] = Math.max(this.orbs[element] + amount, 0);
        } else if (amount > 0) {
            const orbCount = Object.values(this.orbs).reduce((a, b) => a + b, 0);
            for (let i = orbCount; i < 16; i++) {
                if (amount > 0) {
                    this.orbs[element]++;
                    amount--;
                } else {
                    break;
                }
            }
        }
    }

    tapAttack() {
        this.updateOrbs(this.getRandomOrbFromElementWheel(), 1);
        this.elementWheelTowardDefault(2);
    }

    getTapHPDamage(enemy: EnemyActor) {
        return 400;
    }

    getTapYellowGaugeDamage(enemy: EnemyActor) {
        return 200;
    }

    getTapRedGaugeDamage(enemy: EnemyActor) {
        return 400;
    }

    getCardHPDamage(card: Card, enemy: EnemyActor): [number, boolean] {
        let damage = card.ability.attack / card.ability.hits;
        // Attack/Magic
        damage *= PlayerDamage.baseStat(this, card);
        // Element Enhance
        damage *= PlayerDamage.elementEnhance(this, card);
        // Break
        damage *= PlayerDamage.break(this, card, enemy);
        // Weakness
        damage *= PlayerDamage.weakness(this, card, enemy);
        // Critical
        let criticalHit = Math.random() < PlayerDamage.criticalChance(this, card, enemy);
        if (criticalHit) {
            damage *= PlayerDamage.critical(this, card);
        }
        damage = Math.floor(damage);
        // Damage limit
        damage = Math.min(damage, PlayerDamage.damageLimit(card));

        return [damage, criticalHit];
    }

    getCardYellowGaugeDamage(card: Card, enemy: EnemyActor) {
        const damage = card.ability.break / card.ability.hits;
        if (!isResistant(card, enemy) || card.extraSkills.includes(ExtraSkill.GuardBreaker)) {
            return damage;
        } else {
            return 0;
        }
    }

    getCardRedGaugeDamage(card: Card, enemy: EnemyActor) {
        if (
            (!isResistant(card, enemy) || card.extraSkills.includes(ExtraSkill.GuardBreaker)) &&
            (card.extraSkills.includes(ExtraSkill.Mantra) ||
                card.extraSkills.includes(ExtraSkill.Taijutsu))
        ) {
            return 0;
        } else {
            return 0;
        }
    }

    driveElement(elementIndex: number) {
        const element = this.getMainJob().elements[elementIndex];
        // Figure out the removed amount and indexes of remaining elements
        const toBeRemoved = this.wheel[elementIndex];
        const remainingIndexes = [0, 1, 2];
        remainingIndexes.splice(elementIndex, 1);

        // toBeRemoved is 100
        if (this.wheel[remainingIndexes[0]] === 0 && this.wheel[remainingIndexes[1]] === 0) {
            this.wheel[remainingIndexes[0]] = 50;
            this.wheel[remainingIndexes[1]] = 50;
        } else {
            // If both remaining elements have some amount left, divide toBeRemoved between them. Otherwise, put element to 100.
            if (this.wheel[remainingIndexes[0]] > 0) {
                if (this.wheel[remainingIndexes[1]] > 0) {
                    this.wheel[remainingIndexes[0]] += toBeRemoved / 2;
                } else {
                    this.wheel[remainingIndexes[0]] = 100;
                }
            }
            if (this.wheel[remainingIndexes[1]] > 0) {
                if (this.wheel[remainingIndexes[0]] > 0) {
                    this.wheel[remainingIndexes[1]] += toBeRemoved / 2;
                } else {
                    this.wheel[remainingIndexes[1]] = 100;
                }
            }
        }
        this.addResistElementEffect(element, this.orbs[element]);
        // Remove the driven element from wheel
        this.wheel[elementIndex] = 0;
        // Remove the orbs
        this.orbs[element] = 0;
    }

    addResistElementEffect(element: Element, amount: number) {
        let resistElement = Boon.ResistFire;
        switch (element) {
            case "fire":
                resistElement = Boon.ResistFire;
                break;
            case "water":
                resistElement = Boon.ResistWater;
                break;
            case "wind":
                resistElement = Boon.ResistWind;
                break;
            case "earth":
                resistElement = Boon.ResistEarth;
                break;
            case "light":
                resistElement = Boon.ResistLight;
                break;
            case "dark":
                resistElement = Boon.ResistDark;
                break;
        }
        const currentEffect = this.effects.filter((effect) => effect.name === resistElement)[0];
        const currentResistancePoints = (currentEffect && currentEffect.resistancePoints) || 0;
        const newResistancePoints = Math.min(currentResistancePoints + amount, 10);

        this.addEffect({
            name: resistElement,
            duration: Math.ceil(newResistancePoints / 2),
            target: "self",
            resistancePoints: newResistancePoints,
        });
    }

    // Moves element wheel a specified amount toward the default of [100/3, 100/3, 100/3]
    elementWheelTowardDefault(amount: number) {
        // Calculate how many elements are under and over the default
        // Ranges from 0 to 2
        let underDefault = 0;
        let overDefault = 0;
        this.wheel.forEach((elementPercentage) => {
            if (elementPercentage > 100 / 3) {
                overDefault += 1;
            } else if (elementPercentage < 100 / 3) {
                underDefault += 1;
            }
        });

        for (let i = 0; i < this.wheel.length; i++) {
            const elementIndexes = [0, 1, 2];
            if (this.wheel[i] > 100 / 3) {
                // Check if it goes below default
                if (this.wheel[i] - amount * underDefault <= 100 / 3) {
                    // Calculate the leftover amount and apply it to a valid element
                    const leftover = this.wheel[i] - amount * underDefault - 100 / 3;
                    this.wheel[i] = 100 / 3;
                    elementIndexes.splice(i, 1);
                    if (this.wheel[elementIndexes[0]] < 100 / 3) {
                        this.wheel[elementIndexes[0]] -= leftover;
                    } else if (this.wheel[elementIndexes[1]] < 100 / 3) {
                        this.wheel[elementIndexes[1]] -= leftover;
                    }
                } else {
                    this.wheel[i] -= amount * underDefault;
                }
            } else if (this.wheel[i] < 100 / 3) {
                // Check if it goes above default
                if (this.wheel[i] + amount * overDefault >= 100 / 3) {
                    // Calculate the leftover amount and apply it to a valid element
                    const leftover = this.wheel[i] + amount * overDefault - 100 / 3;
                    this.wheel[i] = 100 / 3;
                    elementIndexes.splice(i, 1);
                    if (this.wheel[elementIndexes[0]] > 100 / 3) {
                        this.wheel[elementIndexes[0]] += leftover;
                    } else if (this.wheel[elementIndexes[1]] > 100 / 3) {
                        this.wheel[elementIndexes[1]] += leftover;
                    }
                } else {
                    this.wheel[i] += amount * overDefault;
                }
            }
        }
    }

    getRandomOrbFromElementWheel(): FullElement {
        const lifeOrbChance = 5; // Percents
        let random = Math.floor(Math.random() * (100 + lifeOrbChance));
        let element: FullElement = "life";
        let allPercentages = 0;
        for (let i = 0; i < this.wheel.length; i++) {
            if (this.wheel[i] + allPercentages >= random) {
                element = this.getMainJob().elements[i];
                break;
            } else {
                allPercentages += this.wheel[i];
            }
        }
        return element;
    }

    takeDamage(damage: number) {
        const hp = this.getMainJob().stats.hp;
        hp.current = Math.max(hp.current - damage, 0);
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

export default PlayerActor;
