import PlayerActor, { PlayerInput } from "../PlayerActor";
import { Card } from "../../data/game/cards";
import { emptyPlayerActor, emptyCard, emptyBattleCard, emptyEnemyActor } from "./index.test";
import { Ailment, BattleAction, Boon } from "../types";
import Battle from "../Battle";

test("Mix Auto-Abilities from Job and Cards", () => {
    const playerInput: PlayerInput = JSON.parse(JSON.stringify(emptyPlayerActor));
    const card: Card = JSON.parse(JSON.stringify(emptyCard));
    const card1 = Object.assign({}, card);
    card1.autoAbilities = {
        hpUp: 12,
        enhanceFire: 40,
        painfulBreak: 80,
    };
    const card2 = Object.assign({}, card);
    card2.autoAbilities = {
        hpUp: 5,
        enhanceFire: 20,
        painfulBreak: 10,
        piercingBreak: 35,
    };
    playerInput.deck[0].job.stats.hp = 100;
    playerInput.deck[0].job.elementEnhance = {
        fire: 15,
    };
    playerInput.deck[0].job.autoAbilities = {
        painfulBreak: 45,
    };
    playerInput.deck[0].cards[0] = card1;
    playerInput.deck[0].cards[1] = card2;
    const player = new PlayerActor(playerInput);
    expect(player.getMainJob().stats.hp.current).toBe(117);
    expect(player.getMainJob().elementEnhance.fire).toBe(75);
    expect(player.getMainAA()).toStrictEqual({
        painfulBreak: 135,
        piercingBreak: 35,
    });
});

test("Ultimate damage multipliers", () => {
    const playerInput: PlayerInput = JSON.parse(JSON.stringify(emptyPlayerActor));
    playerInput.deck[0].job.ultimate.attack = 1000;
    playerInput.deck[0].job.ultimate.breakPower = 500;
    playerInput.deck[0].job.ultimate.level = 10;
    const player = new PlayerActor(playerInput);
    expect(player.ultimate.max).toBe(80);
    expect(player.getMainJob().ultimate.attack).toBe(3000);
    expect(player.getMainJob().ultimate.breakPower).toBe(1500);
});

describe("Replacing Boons and Ailments", () => {
    test("Refresh duration of a square Boon with a square Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Update a square Boon to a hexagon Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 5,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(5);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Don't refresh duration of a square Ailment with a square Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Update a square Ailment to a hexagon Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("square");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Cancel a square Boon with a countering square Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effects.length).toBe(0);
    });

    test("Cancel a square Ailment with a countering square Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("square");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effects.length).toBe(0);
    });

    test("Replace a square Boon with a countering hexagon Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Replace a square Ailment with a countering hexagon Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("square");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Don't replace a hexagon Boon with a countering square Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Don't replace a hexagon Ailment with a countering square Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.getActiveEffect(Ailment.Curse)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Ailment.Curse)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Replace a square Boon with a hexagon Boon II", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.FaithII,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Replace a hexagon Boon with a hexagon Boon II", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.FaithII,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Don't replace a hexagon Boon II with a hexagon Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.FaithII,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Don't replace a hexagon Boon with a square Boon II", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.FaithII,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.effectActive(Boon.FaithII)).toBe(false);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
    });

    test("Replace a square Boon with a square Boon II", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.Faith,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.FaithII,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.Faith)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Replace a square Boon II with a hexagon Boon", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.FaithII,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("square");
        expect(player.getActiveEffect(Boon.FaithII)?.duration).toBe(3);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Boon.Faith,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Boon.Faith)).toBe(true);
        expect(player.effectActive(Boon.FaithII)).toBe(false);
        expect(player.getActiveEffect(Boon.Faith)?.type).toBe("hexagon");
        expect(player.getActiveEffect(Boon.Faith)?.duration).toBe(4);
        expect(player.effects.length).toBe(1);
    });

    test("Cancel a square Boon II with a countering square Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.FaithII,
            duration: 3,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("square");
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "square",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(false);
        expect(player.effects.length).toBe(0);
    });

    test("Cancel a hexagon Boon II with a countering hexagon Ailment", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Boon.FaithII,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.getActiveEffect(Boon.FaithII)?.type).toBe("hexagon");
        expect(player.effectActive(Boon.FaithII)).toBe(true);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.Curse,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Boon.FaithII)).toBe(false);
        expect(player.effects.length).toBe(0);
    });

    test("Replace a hexagon Ailment with a hexagon Ailment II", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.addEffect({
            name: Ailment.Curse,
            duration: 3,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(true);
        expect(player.effects.length).toBe(1);
        player.addEffect({
            name: Ailment.CurseII,
            duration: 4,
            target: "self",
            type: "hexagon",
        });
        expect(player.effectActive(Ailment.Curse)).toBe(false);
        expect(player.effectActive(Ailment.CurseII)).toBe(true);
        expect(player.effects.length).toBe(1);
    });
});

test("Ability cooldown", () => {
    const card = JSON.parse(JSON.stringify(emptyBattleCard));
    const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
    decks[0].cards[0] = card;
    const battle = new Battle({
        deck: decks,
        ultimate: 100,
        enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
        difficulty: 1,
        battleResources: {},
        activeDeck: 0,
    });
    card.ability.cooldown.max = 3;
    battle.cardAbility(0);
    expect(card.ability.cooldown.current).toBe(3);
    battle.endTurn();
    expect(card.ability.cooldown.current).toBe(2);
    battle.waveCompleted();
    expect(card.ability.cooldown.current).toBe(1);
    battle.endTurn();
    expect(card.ability.cooldown.current).toBe(0);
    battle.endTurn();
    expect(card.ability.cooldown.current).toBe(0);
});

describe("Orb manipulation", () => {
    test("Draw", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 0,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        };
        expect(Object.values(player.orbs).reduce((a, b) => a + b, 0)).toBe(0);
        player.drawOrbs(3);
        expect(Object.values(player.orbs).reduce((a, b) => a + b, 0)).toBe(3);
        player.drawOrbs(9);
        expect(Object.values(player.orbs).reduce((a, b) => a + b, 0)).toBe(12);
    });

    test("Add and remove", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 0,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        };
        player.addOrRemoveOrbs("fire", 5);
        expect(player.orbs).toStrictEqual({
            fire: 5,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        });
        player.addOrRemoveOrbs("fire", -2);
        player.addOrRemoveOrbs("dark", -5);
        player.addOrRemoveOrbs("light", 20);
        expect(player.orbs).toStrictEqual({
            fire: 3,
            water: 0,
            wind: 0,
            earth: 0,
            light: 13,
            dark: 0,
            life: 0,
            prismatic: 0,
        });
    });

    test("Shift", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 3,
            water: 4,
            wind: 0,
            earth: 6,
            light: 0,
            dark: 0,
            life: 3,
            prismatic: 0,
        };
        player.shiftOrbs("prismatic");
        expect(player.orbs).toStrictEqual({
            fire: 0,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 3,
            prismatic: 13,
        });
    });

    test("Shift and include life", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 3,
            water: 4,
            wind: 0,
            earth: 6,
            light: 0,
            dark: 0,
            life: 3,
            prismatic: 0,
        };
        player.shiftOrbs("prismatic", true);
        expect(player.orbs).toStrictEqual({
            fire: 0,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 16,
        });
    });

    test("Shift and include prismatic", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 3,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 3,
            prismatic: 10,
        };
        player.shiftOrbs("fire", true, true);
        expect(player.orbs).toStrictEqual({
            fire: 16,
            water: 0,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 0,
            life: 0,
            prismatic: 0,
        });
    });

    test("Shift elements", () => {
        const player = new PlayerActor(JSON.parse(JSON.stringify(emptyPlayerActor)));
        player.orbs = {
            fire: 3,
            water: 2,
            wind: 0,
            earth: 8,
            light: 0,
            dark: 0,
            life: 3,
            prismatic: 0,
        };
        player.shiftElements(["fire", "earth"], "dark");
        expect(player.orbs).toStrictEqual({
            fire: 0,
            water: 2,
            wind: 0,
            earth: 0,
            light: 0,
            dark: 11,
            life: 3,
            prismatic: 0,
        });
    });

    test("Elementforce affecting the element wheel", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "flameforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.player.removeEffect(Boon.Flameforce, battle.player);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(false);
        expect(battle.player.wheel).toStrictEqual([100 / 3, 100 / 3, 100 / 3]);
    });

    test("Driving elements doesn't affect the wheel while Elementforce is in effect", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "flameforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
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
        battle.player.driveElement(battle.player.getMainJob().elements.indexOf("fire"));
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
    });

    test("Tap attacking doesn't affect the wheel while Elementforce is in effect", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "flameforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.action(BattleAction.Tap);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
    });

    test("Elementforce getting replaced by Elementforce of different element", () => {
        const card1 = JSON.parse(JSON.stringify(emptyBattleCard));
        card1.effect = [
            {
                name: "flameforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const card2 = JSON.parse(JSON.stringify(emptyBattleCard));
        card2.effect = [
            {
                name: "iceforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card1;
        decks[0].cards[1] = card2;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.cardAbility(1);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(false);
        expect(battle.player.effectActive(Boon.Iceforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([0, 100, 0]);
    });

    test("Elementforce, that's not part of the job's elements, is not added", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "darkforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(false);
        expect(battle.player.wheel).toStrictEqual([100 / 3, 100 / 3, 100 / 3]);
    });

    test("Elementforce not getting replaced by Elementforce that's not part of job's elements", () => {
        const card1 = JSON.parse(JSON.stringify(emptyBattleCard));
        card1.effect = [
            {
                name: "flameforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const card2 = JSON.parse(JSON.stringify(emptyBattleCard));
        card2.effect = [
            {
                name: "darkforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card1;
        decks[0].cards[1] = card2;
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.cardAbility(1);
        expect(battle.player.effectActive(Boon.Flameforce)).toBe(true);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(false);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
    });

    test("Elementforce removed on Job Change if the new job's elements can't utilize the Elementforce", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "darkforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        decks[0].job.elements = ["dark", "water", "earth"];
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.action(BattleAction.JobChange);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(false);
        expect(battle.player.wheel).toStrictEqual([100 / 3, 100 / 3, 100 / 3]);
    });

    test("Elementforce not removed on Job Change if the new job's elements can utilize the Elementforce", () => {
        const card = JSON.parse(JSON.stringify(emptyBattleCard));
        card.effect = [
            {
                name: "darkforce",
                duration: 3,
                target: "self",
                timing: "before",
            },
        ];
        const decks = JSON.parse(JSON.stringify(emptyPlayerActor.deck));
        decks[0].cards[0] = card;
        decks[0].job.elements = ["dark", "water", "earth"];
        decks[1].job.elements = ["dark", "water", "earth"];
        const battle = new Battle({
            deck: decks,
            ultimate: 100,
            enemies: [[JSON.parse(JSON.stringify(emptyEnemyActor))]],
            difficulty: 1,
            battleResources: {},
            activeDeck: 0,
        });
        battle.cardAbility(0);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
        battle.action(BattleAction.JobChange);
        expect(battle.player.effectActive(Boon.Darkforce)).toBe(true);
        expect(battle.player.wheel).toStrictEqual([100, 0, 0]);
    });
});
