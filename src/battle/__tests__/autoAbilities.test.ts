import { test, expect, describe, beforeEach, afterAll } from "vitest";
import EnemyActor from "../EnemyActor";
import PlayerActor, { PlayerInput } from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { Job } from "../../data/game/jobs";
import { AutoAbility, BattleCard, ExtraSkill } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor, emptyBattleCard } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";

describe("Auto-Abilities", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: BattleCard;
    const passedTests: Set<AutoAbility> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyBattleCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
    });

    // Check that Cards and Jobs don't have unsupported Auto-Abilities on them
    afterAll(async () => {
        const cards = (await getGameData("Card")) as Array<Card>;
        cards.forEach((card) => {
            const autoAbilities = Object.keys(card.autoAbilities) as Array<AutoAbility>;
            autoAbilities.forEach((autoAbility) => {
                if (!passedTests.has(autoAbility)) {
                    console.log(`Card:\t${card.id}\tAuto-Ability:\t${autoAbility}`);
                }
            });
        });

        const jobs = (await getGameData("Job")) as Array<Job>;
        jobs.forEach((job) => {
            const autoAbilities = Object.keys(job.autoAbilities) as Array<AutoAbility>;
            autoAbilities.forEach((autoAbility) => {
                if (!passedTests.has(autoAbility)) {
                    console.log(`Job:\t${job.id}\tAuto-Ability:\t${autoAbility}`);
                }
            });
        });
    });

    test("Element Enhance", () => {
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        player.getMainJob().elementEnhance.fire = 200;
        card.element = "fire";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "water";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceFire);

        player.getMainJob().elementEnhance.water = 200;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "wind";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceWater);

        player.getMainJob().elementEnhance.wind = 200;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "earth";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceWind);

        player.getMainJob().elementEnhance.earth = 200;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "light";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceEarth);

        player.getMainJob().elementEnhance.light = 200;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "dark";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceLight);

        player.getMainJob().elementEnhance.dark = 200;
        expect(PlayerDamage.elementEnhance(player, card)).toBe(3);
        card.element = "life";
        expect(PlayerDamage.elementEnhance(player, card)).toBe(1);
        passedTests.add(AutoAbility.EnhanceDark);
    });

    test("Stat up from Job", () => {
        const playerInput: PlayerInput = JSON.parse(JSON.stringify(emptyPlayerActor));
        playerInput.deck[0].job.autoAbilities = {
            hpUp: 11,
            attackUp: 12,
            breakPowerUp: 13,
            magicUp: 14,
        };
        playerInput.deck[0].job.stats.hp = 100;
        playerInput.deck[0].job.stats.attack = 100;
        playerInput.deck[0].job.stats.breakPower = 100;
        playerInput.deck[0].job.stats.magic = 100;
        const player = new PlayerActor(playerInput);
        expect(player.getMainJob().stats.hp.current).toBe(111);
        expect(player.getMainJob().stats.attack).toBe(112);
        expect(player.getMainJob().stats.breakPower).toBe(113);
        expect(player.getMainJob().stats.magic).toBe(114);
    });

    test("Stat up from Card", () => {
        const playerInput: PlayerInput = JSON.parse(JSON.stringify(emptyPlayerActor));
        const card: Card = JSON.parse(JSON.stringify(emptyCard));
        card.autoAbilities = {
            hpUp: 15,
            attackUp: 16,
            breakPowerUp: 17,
            magicUp: 18,
        };
        playerInput.deck[0].job.stats.hp = 100;
        playerInput.deck[0].job.stats.attack = 100;
        playerInput.deck[0].job.stats.breakPower = 100;
        playerInput.deck[0].job.stats.magic = 100;
        playerInput.deck[0].cards[0] = card;
        const player = new PlayerActor(playerInput);
        expect(player.getMainJob().stats.hp.current).toBe(115);
        expect(player.getMainJob().stats.attack).toBe(116);
        expect(player.getMainJob().stats.breakPower).toBe(117);
        expect(player.getMainJob().stats.magic).toBe(118);
    });

    test("Stat up from Job and Card", () => {
        const playerInput: PlayerInput = JSON.parse(JSON.stringify(emptyPlayerActor));
        playerInput.deck[0].job.autoAbilities = {
            hpUp: 11,
            attackUp: 12,
            breakPowerUp: 13,
            magicUp: 14,
        };
        const card: Card = JSON.parse(JSON.stringify(emptyCard));
        card.autoAbilities = {
            hpUp: 15,
            attackUp: 16,
            breakPowerUp: 17,
            magicUp: 18,
        };
        playerInput.deck[0].job.stats.hp = 100;
        playerInput.deck[0].job.stats.attack = 100;
        playerInput.deck[0].job.stats.breakPower = 100;
        playerInput.deck[0].job.stats.magic = 100;
        playerInput.deck[0].cards[0] = card;
        const player = new PlayerActor(playerInput);
        expect(player.getMainJob().stats.hp.current).toBe(126);
        passedTests.add(AutoAbility.HPUp);
        expect(player.getMainJob().stats.attack).toBe(128);
        passedTests.add(AutoAbility.AttackUp);
        expect(player.getMainJob().stats.breakPower).toBe(130);
        passedTests.add(AutoAbility.BreakPowerUp);
        expect(player.getMainJob().stats.magic).toBe(132);
        passedTests.add(AutoAbility.MagicUp);
    });

    test("Painful Break", () => {
        enemy.isBroken = true;
        player.getMainAA().painfulBreak = 200;
        expect(PlayerDamage.break(player, enemy, card)).toBe(4);
        card.innateSkills!.painfulBreak = 150;
        expect(PlayerDamage.break(player, enemy, card)).toBe(5.5);
        passedTests.add(AutoAbility.PainfulBreak);
    });

    test("Piercing Break", () => {
        expect(player.getTapRedGaugeDamage(enemy)).toBe(0);
        expect(player.getCardRedGaugeDamage(card, enemy)).toBe(0);
        expect(player.getUltimateRedGaugeDamage(100, enemy)).toBe(0);
        player.getMainJob().stats.breakPower = 200;
        card.ability.break = 200;
        card.element = "earth";
        card.extraSkills = [ExtraSkill.Mantra];
        expect(player.getTapRedGaugeDamage(enemy)).toBe(200);
        expect(player.getCardRedGaugeDamage(card, enemy)).toBe(600);
        expect(player.getUltimateRedGaugeDamage(100, enemy)).toBe(400);
        player.getMainAA()[AutoAbility.PiercingBreak] = 150;
        expect(player.getTapRedGaugeDamage(enemy)).toBe(500);
        expect(player.getCardRedGaugeDamage(card, enemy)).toBe(1500);
        expect(player.getUltimateRedGaugeDamage(100, enemy)).toBe(1000);
        passedTests.add(AutoAbility.PiercingBreak);
    });
});
