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
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(1);
        player.getMainJob().stats.attack = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(3);
    });

    test("Magic", () => {
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(1);
        player.getMainJob().stats.magic = 200;
        expect(PlayerDamage.baseAttackMagic(player, card)).toBe(3);
    });

    test("Break", () => {
        expect(PlayerDamage.break(player, enemy, card)).toBe(1);
        enemy.isBroken = true;
        expect(PlayerDamage.break(player, enemy, card)).toBe(2);
    });

    test("Weakness", () => {
        enemy.element = "fire";
        card.element = "fire";
        expect(PlayerDamage.weakness(player, enemy, card.element, card)).toBe(1);
        enemy.element = "water";
        expect(PlayerDamage.weakness(player, enemy, card.element, card)).toBe(1.3);
        enemy.isBroken = true;
        expect(PlayerDamage.weakness(player, enemy, card.element, card)).toBe(2);
    });

    test("Critical chance", () => {
        expect(PlayerDamage.criticalChance(player, enemy, card)).toBe(0);
        player.getMainJob().stats.critical = 4;
        card.ability.critical = 3;
        expect(PlayerDamage.criticalChance(player, enemy, card)).toBe(7 * 0.05);
    });

    test("Critical", () => {
        expect(PlayerDamage.critical(player, card)).toBe(1.5);
    });

    test("Defense", () => {
        expect(PlayerDamage.defense(enemy)).toBe(1);
        enemy.defense = 15;
        expect(PlayerDamage.defense(enemy)).toBe(0.85);
    });

    test("Element of Card and Enemy are the same", () => {
        card.ability.attack = 200;
        card.element = "fire";
        enemy.element = "earth";
        expect(player.getCardHPDamage(card, enemy)).toStrictEqual([200, false]);
        enemy.element = "fire";
        expect(player.getCardHPDamage(card, enemy)).toStrictEqual([50, false]);
    });
});
