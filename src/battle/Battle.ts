import { Element } from "../info/types";
import { FullDeck } from "../info/types";
import Player from "./Player";

interface BattleInput {
    deck: FullDeck;
    waves: number;
}

interface BattleInfo {
    score: number;
    wave: {
        current: number;
        max: number;
    };
    elementWheel: {
        elements: {
            main: [Element, Element, Element];
            sub: [Element, Element, Element];
        };
        wheel: [number, number, number];
    };
}

class Battle {
    player: Player;
    score: number;
    wave: {
        current: number;
        max: number;
    };
    constructor(data: BattleInput) {
        console.log("data", data);
        this.player = new Player({ deck: data.deck });
        this.score = 0;
        this.wave = {
            current: 0,
            max: data.waves,
        };
    }

    getBattleInfo(): BattleInfo {
        return {
            score: this.score,
            wave: this.wave,
            elementWheel: {
                elements: {
                    main: this.player.getMainJob().job.elements,
                    sub: this.player.getSubJob().job.elements,
                },
                wheel: [100 / 3, 100 / 3, 100 / 3],
            },
        };
    }
}

export default Battle;
export type { BattleInput, BattleInfo };
