import { Card } from "../data/game/cards";
import { Element, FullDeck, FullElement } from "../info/types";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { AutoAbility, BattleFullDeck, BattleJob, InnateSkill } from "./types";

// Convert FullDeck to BattleFullDeck
// Mix stats from different sources (job, weapon, custom skills, card extra skills)
const createBattleFullDeck = (fullDeck: FullDeck): BattleFullDeck => {
    const mainDeck = fullDeck[0].job;
    const subDeck = fullDeck[1].job;

    const battleMainDeck: BattleJob = {
        id: mainDeck.id,
        name: mainDeck.name,
        resources: {
            card: mainDeck.resources.card,
            thumbnail: mainDeck.resources.thumbnail,
        },
        class: mainDeck.class,
        level: mainDeck.level,
        overboost: mainDeck.overboost,
        elements: mainDeck.elements,
        stats: {
            hp: {
                current: mainDeck.stats.hp,
                max: mainDeck.stats.hp,
            },
            attack: mainDeck.stats.attack,
            break: mainDeck.stats.break,
            magic: mainDeck.stats.magic,
            critical: mainDeck.stats.critical,
            speed: mainDeck.stats.speed,
            defense: mainDeck.stats.defense,
        },
        elementEnhance: {
            fire: mainDeck.elementEnhance.fire || 0,
            water: mainDeck.elementEnhance.water || 0,
            wind: mainDeck.elementEnhance.wind || 0,
            earth: mainDeck.elementEnhance.earth || 0,
            light: mainDeck.elementEnhance.light || 0,
            dark: mainDeck.elementEnhance.dark || 0,
        },
        elementResistance: {
            fire: mainDeck.elementResistance.fire || 0,
            water: mainDeck.elementResistance.water || 0,
            wind: mainDeck.elementResistance.wind || 0,
            earth: mainDeck.elementResistance.earth || 0,
            light: mainDeck.elementResistance.light || 0,
            dark: mainDeck.elementResistance.dark || 0,
        },
        autoAbilities: mainDeck.autoAbilities,
    };
    const battleSubDeck =
        mainDeck.id === subDeck.id
            ? battleMainDeck
            : {
                  id: subDeck.id,
                  name: subDeck.name,
                  resources: {
                      card: subDeck.resources.card,
                      thumbnail: subDeck.resources.thumbnail,
                  },
                  class: subDeck.class,
                  level: subDeck.level,
                  overboost: subDeck.overboost,
                  elements: subDeck.elements,
                  stats: {
                      hp: {
                          current: subDeck.stats.hp,
                          max: subDeck.stats.hp,
                      },
                      attack: subDeck.stats.attack,
                      break: subDeck.stats.break,
                      magic: subDeck.stats.magic,
                      critical: subDeck.stats.critical,
                      speed: subDeck.stats.speed,
                      defense: subDeck.stats.defense,
                  },
                  elementEnhance: {
                      fire: subDeck.elementEnhance.fire || 0,
                      water: subDeck.elementEnhance.water || 0,
                      wind: subDeck.elementEnhance.wind || 0,
                      earth: subDeck.elementEnhance.earth || 0,
                      light: subDeck.elementEnhance.light || 0,
                      dark: subDeck.elementEnhance.dark || 0,
                  },
                  elementResistance: {
                      fire: subDeck.elementResistance.fire || 0,
                      water: subDeck.elementResistance.water || 0,
                      wind: subDeck.elementResistance.wind || 0,
                      earth: subDeck.elementResistance.earth || 0,
                      light: subDeck.elementResistance.light || 0,
                      dark: subDeck.elementResistance.dark || 0,
                  },
                  autoAbilities: subDeck.autoAbilities,
              };

    return [
        {
            job: battleMainDeck,
            cards: fullDeck[0].cards,
        },
        {
            job: battleSubDeck,
            cards: fullDeck[1].cards,
        },
    ];
};

const getStartingOrbs = (
    elements: [Element, Element, Element],
    startingElementCount: number,
    starters?: {
        fire?: number;
        water?: number;
        wind?: number;
        earth?: number;
        light?: number;
        dark?: number;
        life?: number;
        prismatic?: number;
    }
): Record<FullElement, number> => {
    // Add the specified starter elements
    const orbs = {
        fire: starters?.fire || 0,
        water: starters?.water || 0,
        wind: starters?.wind || 0,
        earth: starters?.earth || 0,
        light: starters?.light || 0,
        dark: starters?.dark || 0,
        life: starters?.life || 0,
        prismatic: starters?.prismatic || 0,
    };
    const spaceLeftAfterStarters = Object.values(orbs).reduce((a, b) => a + b, 0);
    // Give first two elements one third of the remaining space and the remaining space to the last
    elements.forEach((element, index) => {
        if (index === elements.length - 1) {
            orbs[element] += startingElementCount - Object.values(orbs).reduce((a, b) => a + b, 0);
        } else {
            orbs[element] += Math.floor(
                (startingElementCount - spaceLeftAfterStarters) / elements.length
            );
        }
    });
    return orbs;
};

const getAutoAbility = (target: PlayerActor | Card, autoAbility: AutoAbility): number => {
    let holder = target instanceof PlayerActor ? target.getMainJob() : target;
    return holder.autoAbilities[autoAbility] || 0;
};

const getInnateSkill = (card: Card, innateSkill: InnateSkill): number => {
    return (card.innateSkills && card.innateSkills[innateSkill]) || 0;
};

const isWeakness = (card: Card, enemy: EnemyActor): boolean => {
    const weaknesses = {
        fire: "water",
        water: "fire",
        wind: "earth",
        earth: "wind",
        light: "dark",
        dark: "light",
        life: "none",
    };
    return weaknesses[card.element] === enemy.element;
};

const isResistant = (card: Card, enemy: EnemyActor): boolean => {
    return card.element === enemy.element;
};

export {
    createBattleFullDeck,
    getStartingOrbs,
    getAutoAbility,
    getInnateSkill,
    isWeakness,
    isResistant,
};
