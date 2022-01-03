import EnemyActor from "../EnemyActor";
import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { ExtraSkill } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";

describe("Extra Skills", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: Card;
    const passedTests: Set<ExtraSkill> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
    });

    // Check that Cards don't have unsupported Extra Skills on them
    afterAll(async () => {
        const cards: Array<Card> = await getGameData("Card");
        cards.forEach((card) => {
            card.extraSkills.forEach((extraSkill) => {
                if (!passedTests.has(extraSkill)) {
                    console.log(`Card:\t${card.id}\tExtra Skill:\t${extraSkill}`);
                }
            });
        });
    });

    test("Bloodthirst", () => {
        enemy.isBroken = true;
        card.extraSkills.push(ExtraSkill.Bloodthirst);
        expect(PlayerDamage.break(player, card, enemy)).toBe(2.15);
        passedTests.add(ExtraSkill.Bloodthirst);
    });

    test("Extreme Bloodthirst", () => {
        enemy.isBroken = true;
        card.extraSkills.push(ExtraSkill.ExtremeBloodthirst);
        expect(PlayerDamage.break(player, card, enemy)).toBe(12);
        passedTests.add(ExtraSkill.ExtremeBloodthirst);
    });

    test("Break Exploiter", () => {
        card.extraSkills.push(ExtraSkill.BreakExploiter);
        enemy.element = "water";
        card.element = "fire";
        expect(PlayerDamage.weakness(player, card, enemy)).toBe(1.3);
        enemy.isBroken = true;
        expect(PlayerDamage.weakness(player, card, enemy)).toBe(2.25);
        passedTests.add(ExtraSkill.BreakExploiter);
    });

    test("Breaker Killer", () => {
        expect(PlayerDamage.criticalChance(player, card, enemy)).toBe(0);
        card.extraSkills.push(ExtraSkill.BreakerKiller);
        enemy.isBroken = true;
        expect(PlayerDamage.criticalChance(player, card, enemy)).toBe(0.15);
        passedTests.add(ExtraSkill.BreakerKiller);
    });

    test("Damage limit", () => {
        expect(PlayerDamage.damageLimit(card)).toBe(99999);

        card.extraSkills.push(ExtraSkill.DamageLimitBreak);
        expect(PlayerDamage.damageLimit(card)).toBe(999999);
        passedTests.add(ExtraSkill.DamageLimitBreak);

        card.extraSkills.push(ExtraSkill.DamageLimitBreakII);
        expect(PlayerDamage.damageLimit(card)).toBe(9999999);
        passedTests.add(ExtraSkill.DamageLimitBreakII);
    });

    test("Mantra", () => {
        card.extraSkills.push(ExtraSkill.Mantra);
        expect(PlayerDamage.baseStat(player, card)).toBe(1);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseStat(player, card)).toBe(3);
        passedTests.add(ExtraSkill.Mantra);
    });

    test("Taijutsu", () => {
        card.extraSkills.push(ExtraSkill.Taijutsu);
        expect(PlayerDamage.baseStat(player, card)).toBe(0.8);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseStat(player, card)).toBe(3 * 0.8);
        passedTests.add(ExtraSkill.Taijutsu);
    });

    test("Vitality Tap", () => {
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        card.extraSkills.push(ExtraSkill.VitalityTap);
        player.getMainJob().stats.hp.current = 1000;
        player.getMainJob().stats.hp.max = 1000;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1.3);
        player.getMainJob().stats.hp.current = 0;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(ExtraSkill.VitalityTap);
    });
});
