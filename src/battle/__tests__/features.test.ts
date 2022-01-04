import PlayerActor, { PlayerInput } from "../PlayerActor";
import { Card } from "../../data/game/cards";
import { emptyPlayerActor, emptyCard } from "./index.test";

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
