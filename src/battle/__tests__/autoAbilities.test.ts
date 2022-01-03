import EnemyActor from "../EnemyActor";
import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { Job } from "../../data/game/jobs";
import { AutoAbility } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor } from "./index.test";
import { getGameData } from "../../extractor";
import console from "console";

describe("Auto-Abilities", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: Card;
    const passedTests: Set<AutoAbility> = new Set();

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
    });

    // Check that Cards and Jobs don't have unsupported Auto-Abilities on them
    afterAll(async () => {
        const cards: Array<Card> = await getGameData("Card");
        const jobs: Array<Job> = await getGameData("Job");
        cards.forEach((card) => {
            Object.keys(card.autoAbilities).forEach((autoAbility) => {
                //@ts-ignore
                if (!passedTests.has(autoAbility)) {
                    console.log(`Card:\t${card.id}\tAuto-Ability:\t${autoAbility}`);
                }
            });
        });

        jobs.forEach((job) => {
            Object.keys(job.autoAbilities).forEach((autoAbility) => {
                //@ts-ignore
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

    test("Painful Break", () => {
        enemy.isBroken = true;
        player.getMainJob().autoAbilities.painfulBreak = 200;
        expect(PlayerDamage.break(player, card, enemy)).toBe(4);
        card.innateSkills!.painfulBreak = 150;
        expect(PlayerDamage.break(player, card, enemy)).toBe(5.5);
        passedTests.add(AutoAbility.PainfulBreak);
    });
});
