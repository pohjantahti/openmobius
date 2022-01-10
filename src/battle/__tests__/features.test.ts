import PlayerActor, { PlayerInput } from "../PlayerActor";
import { Card } from "../../data/game/cards";
import { emptyPlayerActor, emptyCard } from "./index.test";
import { Ailment, Boon } from "../types";

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
    expect(player.getMainJob().autoAbilities).toStrictEqual({
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
