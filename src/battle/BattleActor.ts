import { MAX } from "../info";
import { Target } from "../info/types";
import PlayerActor from "./PlayerActor";
import { Ailment, BattleEffect, Boon } from "./types";

class BattleActor {
    effects: Array<BattleEffect>;

    constructor() {
        this.effects = [];
    }

    // Add effect or reapply current effect with new values
    // https://www.reddit.com/r/MobiusFF/wiki/gameplay/buff-debuff
    // https://www.reddit.com/r/MobiusFF/wiki/cards/ex-cards
    addEffect(
        newEffect: {
            name: Boon | Ailment;
            duration: number;
            target: Target;
            timing?: "before" | "after";
            type?: "square" | "hexagon";
            resistancePoints?: number;
        },
        target?: PlayerActor
    ) {
        if (this.effectActive(newEffect.name)) {
            const currentEffect = this.effects.filter(
                (effect) => effect.name === newEffect.name
            )[0];
            if (currentEffect.type === "square" && newEffect.type === "hexagon") {
                currentEffect.type = "hexagon";
                currentEffect.duration = Math.min(newEffect.duration, MAX.effectDuration);
            } else if (currentEffect.type === "hexagon" && newEffect.type === "square") {
                // Do nothing
            } else if (this.upgradableBoon(newEffect.name)) {
                // Refresh the duration if upgradable Boon
                currentEffect.duration = Math.min(
                    Math.max(currentEffect.duration, newEffect.duration),
                    5
                );
            }
            if (newEffect.resistancePoints && newEffect.resistancePoints >= 0) {
                currentEffect.resistancePoints = newEffect.resistancePoints;
            }
        } else {
            if (this.replaceEffect(newEffect.name, newEffect.type, target)) {
                this.effects.push({
                    name: newEffect.name,
                    type: newEffect.type || "square",
                    duration: Math.min(newEffect.duration, MAX.effectDuration),
                    resistancePoints: newEffect.resistancePoints,
                });
                // Increased HP effect
                this.changeHP(true, newEffect.name, target);
            }
        }
    }

    // Used to determine if new effect replaces/removes old effects.
    // It's far from pretty but it passes all the tests so it will stay like this for now.
    replaceEffect(
        newEffectName: Boon | Ailment,
        newEffectType = "square",
        target?: PlayerActor
    ): boolean {
        const counterparts = [
            [Boon.Barrier, [Boon.BarrierII, Ailment.Debarrier, Ailment.DebarrierII]],
            [Boon.BarrierII, [Boon.Barrier, Ailment.Debarrier, Ailment.DebarrierII]],
            [Ailment.Debarrier, [Ailment.DebarrierII, Boon.Barrier, Boon.BarrierII]],
            [Ailment.DebarrierII, [Ailment.Debarrier, Boon.Barrier, Boon.BarrierII]],
            [Boon.Brave, [Boon.BraveII, Ailment.Debrave, Ailment.DebraveII]],
            [Boon.BraveII, [Boon.Brave, Ailment.Debrave, Ailment.DebraveII]],
            [Ailment.Debrave, [Ailment.DebraveII, Boon.Brave, Boon.BraveII]],
            [Ailment.DebraveII, [Ailment.Debrave, Boon.Brave, Boon.BraveII]],
            [Boon.Faith, [Boon.FaithII, Ailment.Curse, Ailment.CurseII]],
            [Boon.FaithII, [Boon.Faith, Ailment.Curse, Ailment.CurseII]],
            [Ailment.Curse, [Ailment.CurseII, Boon.Faith, Boon.FaithII]],
            [Ailment.CurseII, [Ailment.Curse, Boon.Faith, Boon.FaithII]],
            [Boon.Boost, [Boon.BoostII, Ailment.Slump]],
            [Boon.BoostII, [Boon.Boost, Ailment.Slump]],
            [Ailment.Slump, [Boon.Boost, Boon.BoostII]],
            [Boon.Regen, [Ailment.Bio, Ailment.BioII]],
            [Ailment.Bio, [Ailment.BioII, Boon.Regen]],
            [Ailment.BioII, [Ailment.Bio, Boon.Regen]],
            [Boon.Drain, [Ailment.HPSap]],
            [Ailment.HPSap, [Boon.Drain]],
            [Boon.Haste, [Ailment.Slow]],
            [Ailment.Slow, [Boon.Haste]],
            [Boon.Wall, [Boon.WallII, Ailment.Unguard]],
            [Boon.WallII, [Boon.Wall, Ailment.Unguard]],
            [Ailment.Unguard, [Boon.Wall, Boon.WallII]],
            [Boon.Berserk, [Boon.BerserkII]],
            [Boon.BerserkII, [Boon.Berserk]],
            [Boon.Snipe, [Boon.SnipeII, Ailment.Debilitate]],
            [Boon.SnipeII, [Boon.Snipe, Ailment.Debilitate]],
            [Ailment.Debilitate, [Boon.Snipe, Boon.SnipeII]],
            [Boon.LucidCast, [Boon.LucidCastII, Ailment.CloudedCast]],
            [Boon.LucidCastII, [Boon.LucidCast, Ailment.CloudedCast]],
            [Ailment.CloudedCast, [Boon.LucidCast, Boon.LucidCastII]],
            [Boon.LucidFist, [Boon.LucidFistII, Ailment.CloudedFist]],
            [Boon.LucidFistII, [Boon.LucidFist, Ailment.CloudedFist]],
            [Ailment.CloudedFist, [Boon.LucidFist, Boon.LucidFistII]],
            [Boon.LucidHunt, [Boon.LucidHuntII, Ailment.CloudedHunt]],
            [Boon.LucidHuntII, [Boon.LucidHunt, Ailment.CloudedHunt]],
            [Ailment.CloudedHunt, [Boon.LucidHunt, Boon.LucidHuntII]],
            [Boon.LucidWar, [Boon.LucidWarII, Ailment.CloudedWar]],
            [Boon.LucidWarII, [Boon.LucidWar, Ailment.CloudedWar]],
            [Ailment.CloudedWar, [Boon.LucidWar, Boon.LucidWarII]],
            [Boon.BreakDefenseUp, [Ailment.BreakDefenseDown, Ailment.BreakDefenseDownII]],
            [Ailment.BreakDefenseDown, [Ailment.BreakDefenseDownII, Boon.BreakDefenseUp]],
            [Ailment.BreakDefenseDownII, [Ailment.BreakDefenseDown, Boon.BreakDefenseUp]],
            [Boon.CriticalResistUp, [Ailment.CriticalResistDown, Ailment.CriticalResistDownII]],
            [Ailment.CriticalResistDown, [Ailment.CriticalResistDownII, Boon.CriticalResistUp]],
            [Ailment.CriticalResistDownII, [Ailment.CriticalResistDown, Boon.CriticalResistUp]],
            [Ailment.Weaken, [Ailment.WeakenII]],
            [Ailment.WeakenII, [Ailment.Weaken]],
            [Boon.EnhanceElementalAttacks, [Boon.EnhanceElementalAttacksII]],
            [Boon.EnhanceElementalAttacksII, [Boon.EnhanceElementalAttacks]],
        ];

        // Check that one of the values is a Boon and the other an Ailment
        const oppositeEffects = (compareThis: string, toThat: string): boolean => {
            return !(
                Object.values(Boon).includes(compareThis as Boon) &&
                Object.values(Boon).includes(toThat as Boon)
            );
        };

        for (const [effect, counters] of counterparts) {
            if (effect === newEffectName) {
                for (const counter of counters) {
                    if (this.effectActive(counter as Boon | Ailment)) {
                        const currentEffect = this.getActiveEffect(counter as Boon | Ailment);
                        // Replace a square Effect with a square Effect II
                        if (
                            newEffectName.substring(newEffectName.length - 2) === "II" &&
                            currentEffect?.type === "square" &&
                            newEffectType === "square"
                        ) {
                            this.removeEffect(counter as Boon | Ailment, target);
                            return true;
                        }

                        // Don't remove a square Effect II unless it's an opposing square Effect
                        if (
                            currentEffect?.name.substring(currentEffect.name.length - 2) === "II" &&
                            currentEffect?.type === "square" &&
                            newEffectType === "square"
                        ) {
                            if (oppositeEffects(currentEffect.name, newEffectName)) {
                                this.removeEffect(counter as Boon | Ailment, target);
                            }
                            return false;
                        }

                        // Don't remove a hexagon Effect II unless it's an opposing hexagon Effect
                        if (
                            currentEffect?.name.substring(currentEffect.name.length - 2) === "II" &&
                            currentEffect?.type === "hexagon" &&
                            newEffectType === "hexagon"
                        ) {
                            if (oppositeEffects(currentEffect.name, newEffectName)) {
                                this.removeEffect(counter as Boon | Ailment, target);
                            }
                            return false;
                        }

                        // Replace a hexagon Effect with a hexagon Effect II
                        if (
                            newEffectName.substring(newEffectName.length - 2) === "II" &&
                            currentEffect?.type === "hexagon" &&
                            newEffectType === "hexagon"
                        ) {
                            this.removeEffect(counter as Boon | Ailment, target);
                            return true;
                        }

                        // Don't remove existing hexagon Effect when trying to add a square Effect
                        if (currentEffect?.type === "hexagon" && newEffectType === "square") {
                            return false;
                        }

                        // Replace a square Effect with a square Effect
                        if (currentEffect?.type === "square" && newEffectType === "square") {
                            this.removeEffect(counter as Boon | Ailment, target);
                            return false;
                        }

                        // Replace a hexagon Effect with a hexagon Effect
                        if (currentEffect?.type === "hexagon" && newEffectType === "hexagon") {
                            this.removeEffect(counter as Boon | Ailment, target);
                            return false;
                        }

                        // Replace a square Effect with a hexagon Effect
                        if (currentEffect?.type === "square" && newEffectType === "hexagon") {
                            this.removeEffect(counter as Boon | Ailment, target);
                            return true;
                        }
                    }
                }
            }
        }
        return true;
    }

    // "Upgragable" meaning its duration can be updated
    // TODO: Put all the relevant Boons here
    upgradableBoon(boonName: Boon | Ailment): boolean {
        const isBoon: boolean = Object.values(Boon).includes(boonName as Boon);
        if (!isBoon) return false;
        switch (boonName) {
            case Boon.ChargingAttack:
            case Boon.CleavingAttack:
            case Boon.MartialArts:
            case Boon.MartialFlow:
                return false;
            default:
                return true;
        }
    }

    getActiveEffect(name: Boon | Ailment): BattleEffect | undefined {
        return this.effects.filter((effect) => effect.name === name)[0];
    }

    effectActive(name: Boon | Ailment): boolean {
        return this.effects.filter((effect) => effect.name === name).length > 0;
    }

    removeEffect(name: Boon | Ailment, target?: PlayerActor) {
        this.effects = this.effects.filter((effect) => effect.name !== name);
        // Remove previously added increased HP effect
        this.changeHP(false, name, target);
    }

    // Reduce effect durations and remove the ones with a duration or resistancePoints of 0
    reduceEffects(target?: PlayerActor, amount = 1) {
        this.effects.forEach((effect) => {
            effect.duration -= amount;
            if (effect.resistancePoints) {
                effect.resistancePoints -= 2;
            }
        });

        for (const effect of this.effects) {
            if (effect.duration <= 0 || (effect.resistancePoints && effect.resistancePoints <= 0)) {
                this.removeEffect(effect.name, target);
            }
        }
    }

    changeHP(multiply: boolean, name: Boon | Ailment, target?: PlayerActor) {
        if (target) {
            const jobs = [target.getMainJob()];
            if (!target.sameJob) {
                jobs.push(target.getSubJob());
            }
            for (const job of jobs) {
                const hp = job.stats.hp;
                let multiplier = 0;
                // Trance
                if (job.class === "warrior") {
                    multiplier += name === Boon.LucidWar ? 30 : 0;
                    multiplier += name === Boon.LucidWarII ? 45 : 0;
                } else if (job.class === "ranger") {
                    multiplier += name === Boon.LucidHunt ? 30 : 0;
                    multiplier += name === Boon.LucidHuntII ? 45 : 0;
                } else if (job.class === "mage") {
                    multiplier += name === Boon.LucidCast ? 40 : 0;
                    multiplier += name === Boon.LucidCastII ? 45 : 0;
                } else if (job.class === "monk") {
                    multiplier += name === Boon.LucidFist ? 30 : 0;
                    multiplier += name === Boon.LucidFistII ? 45 : 0;
                }
                multiplier = 1 + multiplier / 100;

                if (multiply) {
                    if (hp.current === hp.max) {
                        hp.current = Math.ceil(hp.current * multiplier);
                    }
                    hp.max = Math.ceil(hp.max * multiplier);
                } else {
                    hp.current = Math.ceil(hp.current / multiplier);
                    hp.max /= multiplier;
                }
            }
        }
    }
}

export default BattleActor;
