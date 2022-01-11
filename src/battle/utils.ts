import { Card } from "../data/game/cards";
import { MAX } from "../info";
import { CardElement, Deck, Element, FullDeck, FullElement } from "../info/types";
import { capitalize } from "../utils";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { AutoAbility, BattleDeck, BattleFullDeck, Boon, InnateSkill } from "./types";

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

        // Calculate the ultimate level and apply the multiplier to attack and break power
        const getUltimate = () => {
            const ultimateLevels: Record<number, number> = {
                1: 1,
                2: 1.1,
                3: 1.2,
                4: 1.3,
                5: 1.4,
                6: 1.7,
                7: 2,
                8: 2.3,
                9: 2.6,
                10: 3,
            };
            const ultimate = deck.job.ultimate;
            ultimate.level = Math.min(
                ultimate.level + (autoAbilities[AutoAbility.BoostUltimate] || 0),
                MAX.ultimateLevel
            );
            delete autoAbilities[AutoAbility.BoostUltimate];
            ultimate.attack *= ultimateLevels[ultimate.level];
            ultimate.breakPower *= ultimateLevels[ultimate.level];
            return ultimate;
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

        const hp = getStat("hp");
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
                        current: hp,
                        max: hp,
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
                ultimate: getUltimate(),
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

const isWeakness = (usedElement: CardElement, targetElement: Element): boolean => {
    const weaknesses = {
        fire: "water",
        water: "fire",
        wind: "earth",
        earth: "wind",
        light: "dark",
        dark: "light",
        life: "none",
    };
    return weaknesses[usedElement] === targetElement;
};

const getWeaknessWeaponElement = (player: PlayerActor, enemy: EnemyActor): CardElement | false => {
    const pairs: Array<[Boon, CardElement]> = [
        [Boon.FireWeapon, "fire"],
        [Boon.WaterWeapon, "water"],
        [Boon.WindWeapon, "wind"],
        [Boon.EarthWeapon, "earth"],
        [Boon.LightWeapon, "light"],
        [Boon.DarkWeapon, "dark"],
    ];
    for (const [weapon, element] of pairs) {
        if (player.effectActive(weapon)) {
            if (isWeakness(element, enemy.element)) {
                return element;
            }
        }
    }
    return false;
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
    getWeaknessWeaponElement,
    isResistant,
};
