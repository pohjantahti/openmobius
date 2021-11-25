import { Card } from "../data/game/cards";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { AutoAbility, Boon, ExtraSkill, InnateSkill } from "./types";
import { getAutoAbility, getInnateSkill, isWeakness } from "./utils";

// https://www.reddit.com/r/MobiusFF/wiki/gameplay-analysis/damage-calculation
class PlayerDamage {
    static baseStat(player: PlayerActor, card: Card): number {
        let statMod = 0;

        if (
            card.extraSkills.includes(ExtraSkill.Mantra) ||
            card.extraSkills.includes(ExtraSkill.Taijutsu)
        ) {
            let attackMod = player.effectActive(Boon.Brave) ? 100 : 0;
            const multiplier =
                (1 + player.getMainJob().stats.attack / 100) *
                (1 + attackMod / 100) *
                (1 + statMod / 100);
            return card.extraSkills.includes(ExtraSkill.Taijutsu) ? multiplier * 0.8 : multiplier;
        } else {
            let magicMod = player.effectActive(Boon.Faith) ? 50 : 0;
            return (
                (1 + player.getMainJob().stats.magic / 100) *
                (1 + magicMod / 100) *
                (1 + statMod / 100)
            );
        }
    }

    static elementEnhance(player: PlayerActor, card: Card): number {
        const vitalityTap =
            30 *
            Math.pow(player.getMainJob().stats.hp.current / player.getMainJob().stats.hp.max, 3);
        let additionalEE = card.extraSkills.includes(ExtraSkill.VitalityTap) ? vitalityTap : 0;
        let playerEE = 0;
        if (card.element !== "life") {
            playerEE = player.getMainJob().elementEnhance[card.element];
        }
        return 1 + (playerEE + additionalEE) / 100;
    }

    static break(player: PlayerActor, card: Card, enemy: EnemyActor): number {
        if (enemy.isBroken) {
            let additionalBreak = getAutoAbility(player, AutoAbility.PainfulBreak);
            additionalBreak += card.extraSkills.includes(ExtraSkill.Bloodthirst) ? 15 : 0;
            additionalBreak += getInnateSkill(card, InnateSkill.PainfulBreak);
            additionalBreak += card.extraSkills?.includes(ExtraSkill.ExtremeBloodthirst) ? 1000 : 0;
            return 1 + (100 + additionalBreak) / 100;
        } else {
            return 1;
        }
    }

    static weakness(player: PlayerActor, card: Card, enemy: EnemyActor): number {
        if (isWeakness(card, enemy)) {
            let additionalWeakness =
                enemy.isBroken && card.extraSkills.includes(ExtraSkill.BreakExploiter) ? 25 : 0;
            return 1 + (30 + (enemy.isBroken ? 70 : 0) + additionalWeakness) / 100;
        } else {
            return 1;
        }
    }

    static criticalChance(player: PlayerActor, card: Card, enemy: EnemyActor): number {
        let criticalChance = (player.getMainJob().stats.critical + card.ability.critical) * 0.05;
        criticalChance +=
            enemy.isBroken && card.extraSkills.includes(ExtraSkill.BreakerKiller) ? 0.15 : 0;
        return criticalChance;
    }

    static critical(player: PlayerActor, card: Card): number {
        let additionalCritical = 0;
        return 1 + (50 + additionalCritical) / 100;
    }

    static damageLimit(card: Card): number {
        let damageLimit = 99999;
        if (card.extraSkills.includes(ExtraSkill.DamageLimitBreak)) {
            damageLimit = 999999;
        }
        if (card.extraSkills.includes(ExtraSkill.DamageLimitBreakII)) {
            damageLimit = 9999999;
        }
        return damageLimit;
    }
}

export default PlayerDamage;
