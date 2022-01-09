import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { Ailment, Boon, ExtraSkill } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";
import { Job } from "../../data/game/jobs";
import EnemyActor from "../EnemyActor";

describe("Boons and Ailments", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: Card;
    const passedTests: Set<Boon | Ailment> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyCard));
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
                    console.log(`Ultimate:\t${card.id}\tEffect:\t\t${effect.name}`);
                }
            });
        });
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
});
