import { CardElement } from "../info/types";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { Ailment, AutoAbility, BattleCard, Boon, ExtraSkill, InnateSkill } from "./types";
import { getAutoAbility, getInnateSkill, isWeakness } from "./utils";

// https://www.reddit.com/r/MobiusFF/wiki/gameplay-analysis/damage-calculation
class PlayerDamage {
    static baseAttackMagic(player: PlayerActor, card: BattleCard): number {
        let multiplier = 1;
        if (
            card.extraSkills.includes(ExtraSkill.Mantra) ||
            card.extraSkills.includes(ExtraSkill.Taijutsu)
        ) {
            multiplier =
                (1 + player.getMainJob().stats.attack / 100) *
                PlayerDamage.attackMod(player) *
                PlayerDamage.statMod(player);
            multiplier = card.extraSkills.includes(ExtraSkill.Taijutsu)
                ? multiplier * 0.8
                : multiplier;
        } else {
            multiplier =
                (1 + player.getMainJob().stats.magic / 100) *
                PlayerDamage.magicMod(player) *
                PlayerDamage.statMod(player);
        }
        // Anti-Trance
        if (card.class === "warrior") {
            multiplier = player.effectActive(Ailment.CloudedWar) ? 1 : multiplier;
        } else if (card.class === "ranger") {
            multiplier = player.effectActive(Ailment.CloudedHunt) ? 1 : multiplier;
        } else if (card.class === "mage") {
            multiplier = player.effectActive(Ailment.CloudedCast) ? 1 : multiplier;
        } else if (card.class === "monk") {
            multiplier = player.effectActive(Ailment.CloudedFist) ? 1 : multiplier;
        }
        return multiplier;
    }

    static baseBreakPower(player: PlayerActor) {
        return (
            (1 + player.getMainJob().stats.breakPower / 100) *
            PlayerDamage.breakPowerMod(player) *
            PlayerDamage.statMod(player)
        );
    }

    static statMod(player: PlayerActor) {
        let statMod = 0;
        // Trance
        if (player.getMainJob().class === "warrior") {
            statMod += player.effectActive(Boon.LucidWar) ? 30 : 0;
            statMod += player.effectActive(Boon.LucidWarII) ? 45 : 0;
        } else if (player.getMainJob().class === "ranger") {
            statMod += player.effectActive(Boon.LucidHunt) ? 30 : 0;
            statMod += player.effectActive(Boon.LucidHuntII) ? 45 : 0;
        } else if (player.getMainJob().class === "mage") {
            statMod += player.effectActive(Boon.LucidCast) ? 30 : 0;
            statMod += player.effectActive(Boon.LucidCastII) ? 45 : 0;
        } else if (player.getMainJob().class === "monk") {
            statMod += player.effectActive(Boon.LucidFist) ? 30 : 0;
            statMod += player.effectActive(Boon.LucidFistII) ? 45 : 0;
        }
        return 1 + statMod / 100;
    }

    static attackMod(player: PlayerActor) {
        let attackMod = player.effectActive(Boon.Brave) ? 100 : 0;
        return 1 + attackMod / 100;
    }

    static magicMod(player: PlayerActor) {
        let magicMod = player.effectActive(Boon.Faith) ? 50 : 0;
        return 1 + magicMod / 100;
    }

    static breakPowerMod(player: PlayerActor) {
        let breakPowerMod = player.effectActive(Boon.Boost) ? 100 : 0;
        return 1 + breakPowerMod / 100;
    }

    static elementEnhance(player: PlayerActor, card: BattleCard): number {
        let additionalEE = card.extraSkills.includes(ExtraSkill.VitalityTap)
            ? 30 *
              Math.pow(player.getMainJob().stats.hp.current / player.getMainJob().stats.hp.max, 3)
            : 0;
        let playerEE = 0;
        if (card.element !== "life") {
            playerEE = player.getMainJob().elementEnhance[card.element];
        }
        return 1 + (playerEE + additionalEE) / 100;
    }

    static break(player: PlayerActor, enemy: EnemyActor, card?: BattleCard): number {
        const cardBonus = (): number => {
            if (!card) return 0;
            let bonus = card.extraSkills.includes(ExtraSkill.Bloodthirst) ? 15 : 0;
            bonus += getInnateSkill(card, InnateSkill.PainfulBreak);
            bonus += card.extraSkills.includes(ExtraSkill.ExtremeBloodthirst) ? 1000 : 0;
            return bonus;
        };
        if (enemy.isBroken) {
            let additionalBreak = getAutoAbility(player, AutoAbility.PainfulBreak);
            return 1 + (100 + additionalBreak + cardBonus()) / 100;
        } else {
            return 1;
        }
    }

    static weakness(
        player: PlayerActor,
        enemy: EnemyActor,
        usedElement: CardElement,
        card?: BattleCard
    ): number {
        const cardBonus = (): number => {
            if (!card) return 0;
            let bonus =
                enemy.isBroken && card.extraSkills.includes(ExtraSkill.BreakExploiter) ? 25 : 0;
            return bonus;
        };
        if (isWeakness(usedElement, enemy.element)) {
            let additionalWeakness = enemy.isBroken ? 70 : 0;
            return 1 + (30 + additionalWeakness + cardBonus()) / 100;
        } else {
            return 1;
        }
    }

    static criticalChance(
        player: PlayerActor,
        enemy: EnemyActor,
        card?: BattleCard,
        extraStars = 0
    ): number {
        const cardBonus = (): number => {
            if (!card) return 0;
            let bonus = card.ability.critical * 0.05;
            bonus +=
                enemy.isBroken && card.extraSkills.includes(ExtraSkill.BreakerKiller) ? 0.15 : 0;
            return bonus;
        };
        let criticalChance = (player.getMainJob().stats.critical + extraStars) * 0.05;
        return criticalChance + cardBonus();
    }

    static critical(player: PlayerActor, card?: BattleCard): number {
        let additionalCritical = 0;
        return 1 + (50 + additionalCritical) / 100;
    }

    static damageLimit(card: BattleCard): number {
        let damageLimit = 99999;
        if (card.extraSkills.includes(ExtraSkill.DamageLimitBreak)) {
            damageLimit = 999999;
        }
        if (card.extraSkills.includes(ExtraSkill.DamageLimitBreakII)) {
            damageLimit = 9999999;
        }
        return damageLimit;
    }

    static piercingBreak(player: PlayerActor): number {
        let piercingBreak = getAutoAbility(player, AutoAbility.PiercingBreak);
        return 1 + piercingBreak / 100;
    }

    static defense(enemy: EnemyActor, card?: BattleCard) {
        const cardBonus = (): number => {
            if (!card) return 0;
            let bonus = 0;
            return bonus;
        };
        if (!enemy.effectActive(Ailment.Unguard) || !enemy.isBroken) {
            return Math.min(1 + (-enemy.defense + cardBonus()) / 100, 1);
        } else {
            return 1;
        }
    }

    static breakDefense(enemy: EnemyActor): number {
        let breakDefense = enemy.effectActive(Ailment.BreakDefenseDown) ? 50 : 0;
        return 1 + breakDefense / 100;
    }
}

export default PlayerDamage;
