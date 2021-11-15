import Battle, { BattleInput } from "./Battle";

let battle: Battle;

const initBattle = (data: BattleInput) => {
    data = JSON.parse(JSON.stringify(data));
    battle = new Battle(data);
};

export { battle, initBattle };
