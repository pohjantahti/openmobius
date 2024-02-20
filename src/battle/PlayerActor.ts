import { MAX, elementforces } from "../info";
import { Element, FullDeck, FullElement } from "../info/types";
import { capitalize } from "../utils";
import BattleActor from "./BattleActor";
import EnemyActor from "./EnemyActor";
import PlayerDamage from "./PlayerDamage";
import {
    BattleFullDeck,
    BattleJob,
    Boon,
    ExtraSkill,
    AutoAbility,
    BattleCard,
    Ailment,
} from "./types";
import {
    createBattleFullDeck,
    getAutoAbility,
    setStartingOrbs,
    getWeaknessWeaponElement,
    isResistant,
    isWeakness,
} from "./utils";

interface PlayerInput {
    deck: FullDeck;
    ultimate: number;
    activeDeck: 0 | 1;
}

class PlayerActor extends BattleActor {
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

    constructor(data: PlayerInput) {
        super();
        this.deck = createBattleFullDeck(data.deck);
        this.activeDeck = data.activeDeck;
        this.wheel = [100 / 3, 100 / 3, 100 / 3];
        this.ultimate = {
            current: (this.deck[0].job.ultimate.level === 10 ? 80 : 100) * (data.ultimate / 100),
            max: this.deck[0].job.ultimate.level === 10 ? 80 : 100,
        };
        this.sameJob = this.getMainJob().id === this.getSubJob().id;
        this.countdownToJobChange = 4;
        this.orbs = {
            fire: 0,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        };
        setStartingOrbs(this, 16);
        this.actions = this.getMainJob().stats.speed;
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
    getMainAA(): Partial<Record<AutoAbility, number>> {
        return this.deck[this.activeDeck].autoAbilities;
    }

    // Sub refers to the current non-active job
    getSubAA(): Partial<Record<AutoAbility, number>> {
        return this.deck[this.activeDeck].autoAbilities;
    }

    // Main refers to the current active job
    getMainCards(): Array<BattleCard | undefined> {
        return this.deck[this.activeDeck].cards;
    }

    // Sub refers to the current non-active job
    getSubCards(): Array<BattleCard | undefined> {
        return this.deck[this.activeDeck === 0 ? 1 : 0].cards;
    }

    changeJob() {
        this.activeDeck = this.activeDeck ? 0 : 1;
        this.countdownToJobChange = 4;
        this.actions = Math.max(this.actions - 1, 0);
        // Remove incompatible effects
        // Elementforce
        // Remove all the Elementforces that the new job cannot utilize
        const currentElements = this.getMainJob().elements;
        for (const force of Object.keys(elementforces) as Array<Boon | Ailment>) {
            const forceElement = elementforces[force]!;
            if (currentElements.indexOf(forceElement) === -1) {
                if (this.effectActive(force)) {
                    this.removeEffect(force, this);
                }
            }
        }
    }

    resetActions() {
        this.actions = this.getMainJob().stats.speed;
    }

    updateUltimateGauge(amount: number) {
        this.ultimate.current = Math.min(this.ultimate.current + amount, this.ultimate.max);
    }

    tapAttack() {
        this.drawOrbs(1);
        this.elementWheelTowardDefault(2);
        // Ultimate Charger
        this.updateUltimateGauge(getAutoAbility(this, AutoAbility.UltimateCharger));
    }

    getTapHPDamage(enemy: EnemyActor): [number, boolean] {
        // Base damage
        let damage = this.getMainJob().stats.attack;
        // Attack
        damage *= PlayerDamage.attackMod(this);
        // Break
        damage *= PlayerDamage.break(this, enemy);
        // Weakness
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        // Critical
        const criticalHit = Math.random() < PlayerDamage.criticalChance(this, enemy);
        if (criticalHit) {
            damage *= PlayerDamage.critical();
        }
        // Defense
        damage *= PlayerDamage.defense(enemy);
        damage = Math.round(damage);
        // Damage limit
        damage = Math.min(damage, this.getMainAA()[AutoAbility.AttackLimitBreak] ? 999999 : 9999);
        return [damage, criticalHit];
    }

    getTapYellowGaugeDamage(enemy: EnemyActor): number {
        // Base damage
        let damage = this.getMainJob().stats.breakPower;
        // Break Power
        damage *= PlayerDamage.breakPowerMod(this);
        // Stat mods
        damage *= PlayerDamage.statMod(this);
        // Break defense
        damage *= PlayerDamage.breakDefense(enemy);
        // Weakness
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        //Piercing Break
        damage *= PlayerDamage.piercingBreak(this);
        // Reduced damage to yellow gauge
        let reducedDamage = 0.2;
        if (weaknessWeapon) {
            reducedDamage = 0.5;
        }
        damage *= reducedDamage;
        damage = Math.round(damage);
        return damage;
    }

    getTapRedGaugeDamage(enemy: EnemyActor): number {
        // Base damage
        let damage = this.getMainJob().stats.breakPower;
        // Break Power
        damage *= PlayerDamage.breakPowerMod(this);
        // Stat mods
        damage *= PlayerDamage.statMod(this);
        // Break defense
        damage *= PlayerDamage.breakDefense(enemy);
        // Weakness
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        //Piercing Break
        damage *= PlayerDamage.piercingBreak(this);
        damage = Math.round(damage);
        return damage;
    }

    getCardHPDamage(card: BattleCard, enemy: EnemyActor): [number, boolean] {
        let damage = card.ability.attack / card.ability.hits;
        // Attack/Magic
        damage *= PlayerDamage.baseAttackMagic(this, card);
        // Element Enhance
        damage *= PlayerDamage.elementEnhance(this, card);
        // Break
        damage *= PlayerDamage.break(this, enemy, card);
        // Weakness
        damage *= PlayerDamage.weakness(enemy, card.element, card);
        // Critical
        const criticalHit = Math.random() < PlayerDamage.criticalChance(this, enemy, card);
        if (criticalHit) {
            damage *= PlayerDamage.critical();
        }
        // Defense
        damage *= PlayerDamage.defense(enemy, card);
        // Element of Card and Enemy are the same
        if (isResistant(card, enemy)) {
            damage *= 0.25;
        }
        damage = Math.round(damage);
        // Damage limit
        damage = Math.min(damage, PlayerDamage.damageLimit(card));

        return [damage, criticalHit];
    }

    getCardYellowGaugeDamage(card: BattleCard, enemy: EnemyActor): number {
        let damage = card.ability.break / card.ability.hits;
        if (!isResistant(card, enemy) || card.extraSkills.includes(ExtraSkill.GuardBreaker)) {
            // When Mantra/Taijutsu is present, use break power. Otherwise, use magic.
            if (
                card.extraSkills.includes(ExtraSkill.Mantra) ||
                card.extraSkills.includes(ExtraSkill.Taijutsu)
            ) {
                damage *= PlayerDamage.baseBreakPower(this);
            } else {
                damage *= PlayerDamage.baseAttackMagic(this, card);
            }
            // Break defense
            damage *= PlayerDamage.breakDefense(enemy);
            // Weakness
            damage *= PlayerDamage.weakness(enemy, card.element, card);
            // Guard Breaker
            if (isResistant(card, enemy) && card.extraSkills.includes(ExtraSkill.GuardBreaker)) {
                damage *= 0.4;
            }
            // Reduced damage to yellow gauge
            let reducedDamage = 0.2;
            if (isWeakness(card.element, enemy.element)) {
                reducedDamage = 0.5;
            }
            damage *= reducedDamage;
            damage = Math.round(damage);
            return damage;
        } else {
            return 0;
        }
    }

    getCardRedGaugeDamage(card: BattleCard, enemy: EnemyActor): number {
        let damage = card.ability.break / card.ability.hits;
        if (
            (!isResistant(card, enemy) || card.extraSkills.includes(ExtraSkill.GuardBreaker)) &&
            (card.extraSkills.includes(ExtraSkill.Mantra) ||
                card.extraSkills.includes(ExtraSkill.Taijutsu))
        ) {
            // Break Power
            damage *= PlayerDamage.baseBreakPower(this);
            // Break defense
            damage *= PlayerDamage.breakDefense(enemy);
            // Weakness
            damage *= PlayerDamage.weakness(enemy, card.element, card);
            //Piercing Break
            damage *= PlayerDamage.piercingBreak(this);
            damage = Math.round(damage);
            return damage;
        } else {
            return 0;
        }
    }

    getUltimateHPDamage(multiplier: number, enemy: EnemyActor): [number, boolean] {
        // Base damage
        let damage = this.getMainJob().stats.attack;
        // Ultimate level multiplier
        damage *= multiplier / 100;
        // Attack
        damage *= PlayerDamage.attackMod(this);
        // Break
        damage *= PlayerDamage.break(this, enemy);
        // Weakness
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon && this.getMainAA()[AutoAbility.Spellsword]) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        // Critical
        const criticalHit =
            Math.random() <
            PlayerDamage.criticalChance(
                this,
                enemy,
                undefined,
                this.getMainJob().ultimate.critical
            );
        if (criticalHit) {
            damage *= PlayerDamage.critical();
        }
        // Defense
        damage *= PlayerDamage.defense(enemy);
        damage = Math.round(damage);
        // Damage limit
        damage = Math.min(damage, 999999);
        return [damage, criticalHit];
    }

    getUltimateYellowGaugeDamage(multiplier: number, enemy: EnemyActor): number {
        // Base damage
        let damage = this.getMainJob().stats.breakPower;
        // Ultimate level multiplier
        damage *= multiplier / 100;
        // Break Power
        damage *= PlayerDamage.breakPowerMod(this);
        // Stat mods
        damage *= PlayerDamage.statMod(this);
        // Break defense
        damage *= PlayerDamage.breakDefense(enemy);
        // Weakness when Spellsword and weakness weapon active
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon && this.getMainAA()[AutoAbility.Spellsword]) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        //Piercing Break
        damage *= PlayerDamage.piercingBreak(this);
        // Reduced damage to yellow gauge
        let reducedDamage = 0.2;
        if (weaknessWeapon && this.getMainAA()[AutoAbility.Spellsword]) {
            reducedDamage = 0.5;
        }
        damage *= reducedDamage;
        damage = Math.round(damage);
        return damage;
    }

    getUltimateRedGaugeDamage(multiplier: number, enemy: EnemyActor): number {
        // Base damage
        let damage = this.getMainJob().stats.breakPower;
        // Ultimate level multiplier
        damage *= 1 + multiplier / 100;
        // Break Power
        damage *= PlayerDamage.breakPowerMod(this);
        // Stat mods
        damage *= PlayerDamage.statMod(this);
        // Break defense
        damage *= PlayerDamage.breakDefense(enemy);
        // Weakness when Spellsword and weakness weapon active
        const weaknessWeapon = getWeaknessWeaponElement(this, enemy);
        if (weaknessWeapon && this.getMainAA()[AutoAbility.Spellsword]) {
            damage *= PlayerDamage.weakness(enemy, weaknessWeapon);
        }
        //Piercing Break
        damage *= PlayerDamage.piercingBreak(this);
        damage = Math.round(damage);
        return damage;
    }

    driveElement(elementIndex: number) {
        const element = this.getMainJob().elements[elementIndex];
        // If Elementforce is active, don't touch the wheel
        if (!this.isElementforceActive()) {
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
            // Remove the driven element from wheel
            this.wheel[elementIndex] = 0;
        }

        const orbsToDrive = this.orbs[element] + this.orbs["prismatic"];
        this.addResistElementEffect(element, orbsToDrive);
        this.updateUltimateGauge(orbsToDrive);
        // Remove the orbs
        this.orbs[element] = 0;
        this.orbs["prismatic"] = 0;
    }

    driveLife(): number {
        const lifeOrbs = this.orbs["life"] + this.orbs["prismatic"];
        this.orbs["life"] = 0;
        this.orbs["prismatic"] = 0;
        return this.heal(lifeOrbs);
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

    heal(lifeOrbsDriven = 0, percentage = 0): number {
        const hp = this.getMainJob().stats.hp;
        // 8% per life orb
        const heal = Math.ceil(hp.max * 0.08 * lifeOrbsDriven + hp.max * (percentage / 100));
        hp.current = Math.min(hp.current + heal, hp.max);
        return heal;
    }

    // Moves element wheel a specified amount toward the default of [100/3, 100/3, 100/3]
    elementWheelTowardDefault(amount: number) {
        // If Elementforce is active, don't touch the wheel
        if (this.isElementforceActive()) {
            return;
        }
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

    drawOrbs(amount: number) {
        const wheel = this.wheel.slice();
        const elements = this.getMainJob().elements;
        const calculatedChances: Array<number> = [];
        // Calculate the increases to the element draw rates. Sum of results can be higher than 100.
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const autoAbility = `${capitalize(element)}Draw` as AutoAbility;
            const change = wheel[i] * (1 + getAutoAbility(this, autoAbility) / 100);
            calculatedChances.push(change);
        }

        // Calculate life orb chance
        const lifeOrbChance = 8 * (1 + getAutoAbility(this, AutoAbility.LifeDraw) / 100);
        const elementOrbChance = 100 - lifeOrbChance;
        const sumOfCalculatedChances = calculatedChances.reduce((a, b) => a + b, 0);
        const elementChances: Array<number> = [];
        // Calculate the final element chance. Sum of elementChances is elementOrbChance.
        for (let i = 0; i < calculatedChances.length; i++) {
            elementChances.push(elementOrbChance * (calculatedChances[i] / sumOfCalculatedChances));
        }
        // Add lifeOrbChance so that the sum of values is ~100
        elementChances.push(lifeOrbChance);

        // Determine drawn orbs
        const orbCount = Object.values(this.orbs).reduce((a, b) => a + b, 0);
        for (let i = orbCount; i < Math.min(orbCount + amount, MAX.orbCount); i++) {
            const random = Math.floor(Math.random() * 100);
            let allPercentages = 0;
            for (let j = 0; j < elementChances.length; j++) {
                allPercentages += elementChances[j];
                if (allPercentages >= random) {
                    // If last of elementChances, add a life orb
                    // Otherwise, add an element orb
                    if (j === elementChances.length - 1) {
                        this.orbs["life"] += 1;
                        break;
                    } else {
                        this.orbs[elements[j]] += 1;
                        break;
                    }
                }
            }
        }
    }

    addOrRemoveOrbs(element: FullElement, amount: number) {
        if (amount < 0) {
            this.orbs[element] = Math.max(this.orbs[element] + amount, 0);
        } else if (amount > 0) {
            const orbCount = Object.values(this.orbs).reduce((a, b) => a + b, 0);
            for (let i = orbCount; i < Math.min(orbCount + amount, MAX.orbCount); i++) {
                this.orbs[element]++;
            }
        }
    }

    shiftOrbs(element: FullElement, includeLife = false, includePrismatic = false) {
        let orbsToShift = 0;
        for (const element of this.getMainJob().elements) {
            orbsToShift += this.orbs[element];
            this.orbs[element] = 0;
        }
        if (includeLife) {
            orbsToShift += this.orbs["life"];
            this.orbs["life"] = 0;
        }
        if (includePrismatic) {
            orbsToShift += this.orbs["prismatic"];
            this.orbs["prismatic"] = 0;
        }
        this.orbs[element] = orbsToShift;
    }

    shiftElements(from: Array<FullElement>, to: FullElement) {
        let orbsToShift = 0;
        for (const element of from) {
            orbsToShift += this.orbs[element];
            this.orbs[element] = 0;
        }
        this.orbs[to] = orbsToShift;
    }

    takeDamage(damage: number) {
        const hp = this.getMainJob().stats.hp;
        hp.current = Math.max(hp.current - damage, 0);
    }

    reduceCooldowns() {
        for (const card of this.getMainCards()) {
            if (card && card.ability.cooldown.current > 0) {
                card.ability.cooldown.current = Math.max(card.ability.cooldown.current - 1, 0);
            }
        }

        for (const card of this.getSubCards()) {
            if (card && card.ability.cooldown.current > 0) {
                card.ability.cooldown.current = Math.max(card.ability.cooldown.current - 1, 0);
            }
        }
    }

    // Changes the element wheel accordingly when an Elementforce is added or removed
    handelElementforceChangesToWheel(boonAilment: Boon | Ailment, action: "add" | "remove") {
        // Check that boonAilment is an Elementforce
        const element = elementforces[boonAilment];
        if (element) {
            // Check that current job has an element of the Elementforce
            const elementIndex = this.getMainJob().elements.indexOf(element);
            // Adding: set the Elementforce element to 100 and others to 0
            // Removing or resetting: set all the elements to 100 / 3
            if (elementIndex !== -1) {
                if (action === "add") {
                    const newWheel: [number, number, number] = [0, 0, 0];
                    newWheel[elementIndex] = 100;
                    this.wheel = newWheel;
                } else {
                    this.wheel = [100 / 3, 100 / 3, 100 / 3];
                }
            } else {
                this.wheel = [100 / 3, 100 / 3, 100 / 3];
            }
        }
    }

    isElementforceActive(): boolean {
        return (
            this.effectActive(Boon.Flameforce) ||
            this.effectActive(Boon.Iceforce) ||
            this.effectActive(Boon.Windforce) ||
            this.effectActive(Boon.Earthforce) ||
            this.effectActive(Boon.Lightforce) ||
            this.effectActive(Boon.Darkforce)
        );
    }
}

export default PlayerActor;
export type { PlayerInput };
