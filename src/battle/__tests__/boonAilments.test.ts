import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { Ailment, BattleCard, Boon, ExtraSkill } from "../types";
import { emptyPlayerActor, emptyEnemyActor, emptyBattleCard } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";
import { Job } from "../../data/game/jobs";
import EnemyActor from "../EnemyActor";

describe("Boons and Ailments", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: BattleCard;
    const passedTests: Set<Boon | Ailment> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyBattleCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
    });

    // Check that Cards and Jobs don't have unsupported Boons or Ailments on them
    afterAll(async () => {
        const cards: Array<Card> = await getGameData("Card");
        cards.forEach((card) => {
            card.effect?.forEach((effect) => {
                if (!passedTests.has(effect.name)) {
                    console.log(`Card:\t${card.id}\tEffect:\t\t${effect.name}`);
                }
            });
        });

        const jobs: Array<Job> = await getGameData("Job");
        jobs.forEach((job) => {
            job.ultimate.effect?.forEach((effect) => {
                if (!passedTests.has(effect.name)) {
                    console.log(`Ultimate:\t${job.id}\tEffect:\t\t${effect.name}`);
                }
            });
        });
    });

    test("Boost", () => {
        expect(PlayerDamage.baseBreakPower(player)).toBe(1);
        player.addEffect({
            name: Boon.Boost,
            duration: 1,
            target: "self",
        });
        expect(player.effectActive(Boon.Boost)).toBe(true);
        expect(PlayerDamage.baseBreakPower(player)).toBe(2);
        player.getMainJob().stats.breakPower = 200;
        expect(PlayerDamage.baseBreakPower(player)).toBe(6);
        passedTests.add(Boon.Boost);
    });

    test("Brave", () => {
        card.extraSkills.push(ExtraSkill.Mantra);
        player.addEffect({
            name: Boon.Brave,
            duration: 1,
            target: "self",
        });
        expect(player.effectActive(Boon.Brave)).toBe(true);
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(2);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(6);
        passedTests.add(Boon.Brave);
    });

    test("Break Defense Down", () => {
        player.getMainJob().stats.breakPower = 200;
        expect(player.getTapRedGaugeDamage(enemy)).toBe(200);
        enemy.addEffect({
            name: Ailment.BreakDefenseDown,
            duration: 1,
            target: "self",
        });
        expect(player.getTapRedGaugeDamage(enemy)).toBe(300);
        passedTests.add(Ailment.BreakDefenseDown);
    });

    test("Faith", () => {
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 1,
            target: "self",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(1.5);
        player.getMainJob().stats.magic = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(4.5);
        passedTests.add(Boon.Faith);
    });

    describe("Trance", () => {
        test("Lucid War", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidWar,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([780, false]);
            passedTests.add(Boon.LucidWar);
        });
        test("Lucid War II", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidWarII,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([870, false]);
            passedTests.add(Boon.LucidWarII);
        });

        test("Lucid Hunt", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidHunt,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "ranger";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([780, false]);
            passedTests.add(Boon.LucidHunt);
        });
        test("Lucid Hunt II", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidHuntII,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "ranger";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([870, false]);
            passedTests.add(Boon.LucidHuntII);
        });

        test("Lucid Cast", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidCast,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "mage";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([780, false]);
            passedTests.add(Boon.LucidCast);
        });
        test("Lucid Cast II", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidCastII,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "mage";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([870, false]);
            passedTests.add(Boon.LucidCastII);
        });

        test("Lucid Fist", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidFist,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([780, false]);
            passedTests.add(Boon.LucidFist);
        });
        test("Lucid Fist II", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Boon.LucidFistII,
                duration: 1,
                target: "self",
            });
            player.getMainJob().class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.getMainJob().class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([870, false]);
            passedTests.add(Boon.LucidFistII);
        });
    });

    describe("Anti-Trance", () => {
        test("Clouded War", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Ailment.CloudedWar,
                duration: 1,
                target: "self",
            });
            card.class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            card.class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            passedTests.add(Ailment.CloudedWar);
        });
        test("Clouded Hunter", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Ailment.CloudedHunt,
                duration: 1,
                target: "self",
            });
            card.class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            card.class = "ranger";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            passedTests.add(Ailment.CloudedHunt);
        });
        test("Clouded Cast", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Ailment.CloudedCast,
                duration: 1,
                target: "self",
            });
            card.class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            card.class = "mage";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            passedTests.add(Ailment.CloudedCast);
        });
        test("Clouded Fist", () => {
            card.element = "fire";
            enemy.element = "earth";
            card.ability.attack = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            player.getMainJob().stats.magic = 200;
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            player.addEffect({
                name: Ailment.CloudedFist,
                duration: 1,
                target: "self",
            });
            card.class = "warrior";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([600, false]);
            card.class = "monk";
            expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
            passedTests.add(Ailment.CloudedFist);
        });
    });
});
