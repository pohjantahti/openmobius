import { Card } from "../data/game/cards";
import { Deck, Element, FullDeck, FullElement } from "../info/types";
import { capitalize } from "../utils";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { AutoAbility, BattleDeck, BattleFullDeck, InnateSkill } from "./types";

// Convert FullDeck to BattleFullDeck
// Mix stats from different sources (job, weapon, custom skills, card extra skills)
const createBattleFullDeck = (fullDeck: FullDeck): BattleFullDeck => {
    const getBattleDeck = (deck: Deck): BattleDeck => {
        // Add and sum all the Auto-Abilities from cards to one object
        const autoAbilities: Partial<Record<AutoAbility, number>> = {};
        deck.cards.forEach((card) => {
            if (!card) return;
            const cardAA = Object.entries(card.autoAbilities) as Array<[AutoAbility, number]>;
            cardAA.forEach(([autoAbility, value]) => {
                if (autoAbilities[autoAbility] && autoAbilities[autoAbility]! >= 0) {
                    autoAbilities[autoAbility]! += value;
                } else {
                    autoAbilities[autoAbility] = value;
                }
            });
        });

        // Multiply base stat with statUp Auto-Abilities
        const getStat = (stat: "hp" | "attack" | "breakPower" | "magic"): number => {
            let base = deck.job.stats[stat];
            let autoAbility = deck.job.autoAbilities[`${stat}Up`] || 0;
            if (autoAbilities[`${stat}Up`]) {
                autoAbility += autoAbilities[`${stat}Up`]!;
                delete autoAbilities[`${stat}Up`];
            }
            base = Math.round(base * (1 + autoAbility / 100));
            return base;
        };

        // Sum Element Enhance from Job and other sources
        const getElementEnhance = (element: Element) => {
            let enhance = deck.job.elementEnhance[element] || 0;
            const autoAbility = `enhance${capitalize(element)}` as AutoAbility;
            if (autoAbilities[autoAbility]) {
                enhance += autoAbilities[autoAbility]!;
                delete autoAbilities[autoAbility];
            }
            return enhance;
        };

        // Sum Element Resistance from Job and other sources
        const getElementResistance = (element: Element) => {
            let resistance = deck.job.elementResistance[element] || 0;
            const autoAbility = `resist${capitalize(element)}` as AutoAbility;
            if (autoAbilities[autoAbility]) {
                resistance += autoAbilities[autoAbility]!;
                delete autoAbilities[autoAbility];
            }
            return resistance;
        };

        // Combine rest of the Auto-Abilities from Job and other sources
        const getAutoAbilities = () => {
            const jobAA = deck.job.autoAbilities;
            const otherAA = Object.entries(autoAbilities) as Array<[AutoAbility, number]>;
            otherAA.forEach(([autoAbility, value]) => {
                if (jobAA[autoAbility]) {
                    jobAA[autoAbility]! += value;
                } else {
                    jobAA[autoAbility] = value;
                }
            });
            return jobAA;
        };

        return {
            job: {
                id: deck.job.id,
                name: deck.job.name,
                resources: {
                    card: deck.job.resources.card,
                    thumbnail: deck.job.resources.thumbnail,
                },
                class: deck.job.class,
                level: deck.job.level,
                overboost: deck.job.overboost,
                elements: deck.job.elements,
                stats: {
                    hp: {
                        current: getStat("hp"),
                        max: getStat("hp"),
                    },
                    attack: getStat("attack"),
                    breakPower: getStat("breakPower"),
                    magic: getStat("magic"),
                    critical: deck.job.stats.critical,
                    speed: deck.job.stats.speed,
                    defense: deck.job.stats.defense,
                },
                elementEnhance: {
                    fire: getElementEnhance("fire"),
                    water: getElementEnhance("water"),
                    wind: getElementEnhance("wind"),
                    earth: getElementEnhance("earth"),
                    light: getElementEnhance("light"),
                    dark: getElementEnhance("dark"),
                },
                elementResistance: {
                    fire: getElementResistance("fire"),
                    water: getElementResistance("water"),
                    wind: getElementResistance("wind"),
                    earth: getElementResistance("earth"),
                    light: getElementResistance("light"),
                    dark: getElementResistance("dark"),
                },
                autoAbilities: getAutoAbilities(),
            },
            cards: deck.cards,
        };
    };

    const battleMainDeck = getBattleDeck(fullDeck[0]);
    const battleSubDeck =
        fullDeck[0].job.id === fullDeck[1].job.id ? battleMainDeck : getBattleDeck(fullDeck[1]);
    return [battleMainDeck, battleSubDeck];
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
    const holder = target instanceof PlayerActor ? target.getMainJob() : target;
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
