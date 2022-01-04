import EnemyActor from "../EnemyActor";
import PlayerActor from "../PlayerActor";
import PlayerDamage from "../PlayerDamage";
import { Card } from "../../data/game/cards";
import { ExtraSkill } from "../types";
import { emptyPlayerActor, emptyCard, emptyEnemyActor } from "./index.test";

describe("Base stats and multipliers", () => {
    let player: PlayerActor;
    let enemy: EnemyActor;
    let card: Card;

    beforeEach(() => {
        player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        card = JSON.parse(JSON.stringify(emptyCard));
        enemy = new EnemyActor(JSON.parse(JSON.stringify(emptyEnemyActor)), 1);
    });

    test("Attack", () => {
        card.extraSkills.push(ExtraSkill.Mantra);
        expect(PlayerDamage.baseStat(player, card)).toBe(1);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseStat(player, card)).toBe(3);
    });

    test("Magic", () => {
        expect(PlayerDamage.baseStat(player, card)).toBe(1);
        player.getMainJob().stats.magic = 200;
        expect(PlayerDamage.baseStat(player, card)).toBe(3);
    });

    test("Break", () => {
        expect(PlayerDamage.break(player, card, enemy)).toBe(1);
        enemy.isBroken = true;
        expect(PlayerDamage.break(player, card, enemy)).toBe(2);
    });

    test("Weakness", () => {
        enemy.element = "fire";
        card.element = "fire";
        expect(PlayerDamage.weakness(player, card, enemy)).toBe(1);
        enemy.element = "water";
        expect(PlayerDamage.weakness(player, card, enemy)).toBe(1.3);
        enemy.isBroken = true;
        expect(PlayerDamage.weakness(player, card, enemy)).toBe(2);
    });

    test("Critical chance", () => {
        expect(PlayerDamage.criticalChance(player, card, enemy)).toBe(0);
        player.getMainJob().stats.critical = 4;
        card.ability.critical = 3;
        expect(PlayerDamage.criticalChance(player, card, enemy)).toBe(7 * 0.05);
    });

    test("Critical", () => {
        expect(PlayerDamage.critical(player, card)).toBe(1.5);
    });
});