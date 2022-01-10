import EnemyActor from "../EnemyActor";
import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { Ailment, Boon, ExtraSkill } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";
import Battle from "../Battle";

describe("Extra Skills", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: Card;
    let battle: Battle;
    const passedTests: Set<ExtraSkill> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
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
        expect(PlayerDamage.break(player, enemy, card)).toBe(2.15);
        passedTests.add(ExtraSkill.Bloodthirst);
    });

    test("Extreme Bloodthirst", () => {
        enemy.isBroken = true;
        card.extraSkills.push(ExtraSkill.ExtremeBloodthirst);
        expect(PlayerDamage.break(player, enemy, card)).toBe(12);
        passedTests.add(ExtraSkill.ExtremeBloodthirst);
    });

    test("Break Exploiter", () => {
        card.extraSkills.push(ExtraSkill.BreakExploiter);
        enemy.element = "water";
        card.element = "fire";
        expect(PlayerDamage.weakness(player, enemy, card.element, card)).toBe(1.3);
        enemy.isBroken = true;
        expect(PlayerDamage.weakness(player, enemy, card.element, card)).toBe(2.25);
        passedTests.add(ExtraSkill.BreakExploiter);
    });

    test("Breaker Killer", () => {
        expect(PlayerDamage.criticalChance(player, enemy, card)).toBe(0);
        card.extraSkills.push(ExtraSkill.BreakerKiller);
        enemy.isBroken = true;
        expect(PlayerDamage.criticalChance(player, enemy, card)).toBe(0.15);
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

    test("Duration Boost", () => {
        battle.player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
        });
        expect(battle.player.effects[0].duration).toBe(3);
        card.extraSkills = [ExtraSkill.DurationBoost];
        battle.cardAbility(0);
        expect(battle.player.effects[0].duration).toBe(4);
        passedTests.add(ExtraSkill.DurationBoost);
    });

    test("Elemental Mirror", () => {
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.ResistFire)).toBe(false);
        card.extraSkills = [ExtraSkill.ElementalMirror];
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.ResistFire)).toBe(true);
        passedTests.add(ExtraSkill.ElementalMirror);
    });

    test("Elemental Retrieval", () => {
        battle.player.orbs = {
            fire: 16,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        };
        expect(Object.values(battle.player.orbs).reduce((a, b) => a + b, 0)).toBe(16);
        card.element = "fire";
        card.ability.cost = 5;
        battle.cardAbility(0);
        expect(Object.values(battle.player.orbs).reduce((a, b) => a + b, 0)).toBe(11);
        card.extraSkills = [ExtraSkill.ElementalRetrieval];
        battle.cardAbility(0);
        expect(Object.values(battle.player.orbs).reduce((a, b) => a + b, 0)).toBe(7);
        passedTests.add(ExtraSkill.ElementalRetrieval);
    });

    test("Enhanced Ailments", () => {
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effectActive(Ailment.BreakDefenseDown)).toBe(false);
        card.effect = [
            {
                name: Ailment.BreakDefenseDown,
                duration: 3,
                target: "single",
                timing: "after",
            },
        ];
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effectActive(Ailment.BreakDefenseDown)).toBe(true);
        expect(battle.enemies[0][0].effects[0].type).toBe("square");
        card.extraSkills = [ExtraSkill.EnhancedAilments];
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effects[0].type).toBe("hexagon");
        passedTests.add(ExtraSkill.EnhancedAilments);
    });

    test("Enhanced Boons", () => {
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Faith)).toBe(false);
        card.effect = [
            {
                name: Boon.Faith,
                duration: 3,
                target: "self",
                timing: "after",
            },
        ];
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Faith)).toBe(true);
        expect(battle.player.effects[0].type).toBe("square");
        card.extraSkills = [ExtraSkill.EnhancedBoons];
        battle.cardAbility(0);
        expect(battle.player.effects[0].type).toBe("hexagon");
        passedTests.add(ExtraSkill.EnhancedBoons);
    });

    test("Enhanced Life", () => {
        battle.player.getMainJob().stats.hp.current = 1;
        battle.player.getMainJob().stats.hp.max = 100;
        card.element = "life";
        expect(battle.player.getMainJob().stats.hp.current).toBe(1);
        battle.cardAbility(0);
        expect(battle.player.getMainJob().stats.hp.current).toBe(11);
        card.extraSkills = [ExtraSkill.EnhancedLife];
        battle.cardAbility(0);
        expect(battle.player.getMainJob().stats.hp.current).toBe(31);
        passedTests.add(ExtraSkill.EnhancedLife);
    });

    test("Extra Life", () => {
        battle.player.orbs = {
            fire: 15,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        };
        expect(battle.player.orbs.life).toBe(0);
        battle.cardAbility(0);
        expect(battle.player.orbs.life).toBe(0);
        card.extraSkills = [ExtraSkill.ExtraLife];
        battle.cardAbility(0);
        expect(battle.player.orbs.life).toBe(1);
        passedTests.add(ExtraSkill.ExtraLife);
    });

    test("Guard Breaker", () => {
        card.element = "earth";
        enemy.element = "fire";
        card.ability.break = 200;
        expect(player.getCardYellowGaugeDamage(card, enemy)).toBe(40);
        expect(player.getCardRedGaugeDamage(card, enemy)).toBe(0);
        card.element = "fire";
        expect(player.getCardYellowGaugeDamage(card, enemy)).toBe(0);
        card.extraSkills = [ExtraSkill.GuardBreaker];
        expect(player.getCardYellowGaugeDamage(card, enemy)).toBe(16);
        card.extraSkills.push(ExtraSkill.Mantra);
        expect(player.getCardRedGaugeDamage(card, enemy)).toBe(200);
        passedTests.add(ExtraSkill.GuardBreaker);
    });

    test("Lasting Ailments", () => {
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effectActive(Ailment.BreakDefenseDown)).toBe(false);
        card.effect = [
            {
                name: Ailment.BreakDefenseDown,
                duration: 3,
                target: "single",
                timing: "after",
            },
        ];
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effectActive(Ailment.BreakDefenseDown)).toBe(true);
        expect(battle.enemies[0][0].effects[0].duration).toBe(3);
        card.extraSkills = [ExtraSkill.LastingAilments];
        battle.cardAbility(0);
        expect(battle.enemies[0][0].effects[0].duration).toBe(4);
        passedTests.add(ExtraSkill.LastingAilments);
    });

    test("Lasting Boons", () => {
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Faith)).toBe(false);
        card.effect = [
            {
                name: Boon.Faith,
                duration: 3,
                target: "self",
                timing: "after",
            },
        ];
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Faith)).toBe(true);
        expect(battle.player.effects[0].duration).toBe(3);
        card.extraSkills = [ExtraSkill.LastingBoons];
        battle.cardAbility(0);
        expect(battle.player.effects[0].duration).toBe(4);
        passedTests.add(ExtraSkill.LastingBoons);
    });

    test("Mantra", () => {
        card.extraSkills.push(ExtraSkill.Mantra);
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(1);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(3);
        passedTests.add(ExtraSkill.Mantra);
    });

    test("Quick Cast", () => {
        battle.player.actions = 5;
        expect(battle.player.actions).toBe(5);
        battle.cardAbility(0);
        expect(battle.player.actions).toBe(4);
        card.extraSkills = [ExtraSkill.QuickCast];
        battle.cardAbility(0);
        expect(battle.player.actions).toBe(4);
        passedTests.add(ExtraSkill.QuickCast);
    });

    test("Taijutsu", () => {
        card.extraSkills.push(ExtraSkill.Taijutsu);
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(0.8);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(3 * 0.8);
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
