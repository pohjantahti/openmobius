import { Enemy } from "../data/game/enemies";
import { FullDeck, Target } from "../info/types";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import {
    Ailment,
    BattleAction,
    BattleCard,
    BattleInfo,
    Boon,
    DamageToEnemies,
    Effect,
    ExtraSkill,
} from "./types";
import { isWeakness } from "./utils";

interface BattleInput {
    deck: FullDeck;
    ultimate: number;
    enemies: Array<Array<Enemy>>;
    difficulty: number;
    battleResources: Record<string, string>;
    activeDeck: 0 | 1;
}

class Battle {
    battleResources: Record<string, string>;
    player: PlayerActor;
    score: number;
    wave: {
        current: number;
        max: number;
    };
    enemies: Array<Array<EnemyActor>>;
    targetIndex: number;
    damageToEnemies: Array<DamageToEnemies>;
    isBattleCompleted: boolean;
    damageToPlayer: Array<{
        damage: number;
    }>;
    healToPlayer: Array<number>;
    poisonToPlayer: Array<number>;

    constructor(data: BattleInput) {
        this.battleResources = data.battleResources;
        this.player = new PlayerActor({
            deck: data.deck,
            ultimate: data.ultimate,
            activeDeck: data.activeDeck,
        });
        this.score = 0;
        this.wave = {
            current: 0,
            max: data.enemies.length,
        };
        this.enemies = Array.from(data.enemies, (wave: Array<Enemy>) =>
            Array.from(wave, (enemy) => new EnemyActor(enemy, data.difficulty))
        );
        this.targetIndex = 0;
        this.damageToEnemies = [];
        this.isBattleCompleted = false;
        this.damageToPlayer = [];
        this.healToPlayer = [];
        this.poisonToPlayer = [];
    }

    getBattleInfo(): BattleInfo {
        return {
            battleResources: this.battleResources,
            score: this.score,
            wave: this.wave,
            elements: {
                main: this.player.getMainJob().elements,
                sub: this.player.getSubJob().elements,
            },
            elementWheel: [...this.player.wheel],
            cards: this.player.getMainCards(),
            ultimate: {
                gauge: {
                    current: this.player.ultimate.current,
                    max: this.player.ultimate.max,
                },
                name: this.player.getMainJob().ultimate.name,
            },
            jobClass: this.player.getMainJob().class,
            enemies: this.enemies[this.wave.current],
            targetIndex: this.targetIndex,
            hp: {
                main: {
                    current: this.player.getMainJob().stats.hp.current,
                    max: this.player.getMainJob().stats.hp.max,
                },
                sub: this.player.sameJob
                    ? undefined
                    : {
                          current: this.player.getSubJob().stats.hp.current,
                          max: this.player.getSubJob().stats.hp.max,
                      },
            },
            countdownToJobChange: this.player.countdownToJobChange,
            orbs: this.player.orbs,
            actions: this.player.actions,
            damageToEnemies: this.damageToEnemies,
            isBattleCompleted: this.isBattleCompleted,
            playerCard: this.player.getMainJob().resources.card,
            damageToPlayer: this.damageToPlayer,
            playerEffects: this.player.effects,
            healToPlayer: this.healToPlayer,
            poisonToPlayer: this.poisonToPlayer,
            music: this.player.getMainJob().resources.music,
        };
    }

    action(action: BattleAction, index?: number): void {
        switch (action) {
            case BattleAction.JobChange:
                this.player.changeJob();
                break;
            case BattleAction.ChangeTarget:
                this.targetIndex = index!;
                break;
            case BattleAction.Tap:
                this.tapAttack();
                break;
            case BattleAction.Card:
                this.cardAbility(index!);
                break;
            case BattleAction.Drive:
                if (index === 3) {
                    this.healToPlayer = [this.player.driveLife()];
                } else {
                    this.player.driveElement(index!);
                }
                break;
            case BattleAction.Ultimate:
                this.ultimate();
                break;
        }
        console.log("ACTION", action, index);
    }

    waveCompleted() {
        console.log("Wave completed", this.wave.current, this.wave.max);
        this.player.countdownToJobChange -= 1;
        this.player.reduceEffects(this.player);
        this.player.reduceCooldowns();

        if (this.wave.current + 1 === this.wave.max) {
            this.battleCompleted();
        } else {
            this.wave.current += 1;
            this.player.resetActions();
        }
        this.targetIndex = 0;
    }

    battleCompleted() {
        console.log("Battle completed");
        this.isBattleCompleted = true;
    }

    useAction() {
        this.player.actions = Math.max(this.player.actions - 1, 0);

        // Reduce break duration on enemies and unbreak valid enemies
        this.enemies[this.wave.current].forEach((enemy) => {
            if (enemy.hp.current > 0 && enemy.isBroken) {
                enemy.breakLength.current -= 1;
                if (enemy.breakLength.current < 1) {
                    enemy.isBroken = false;
                    enemy.breakGauge.yellow.current = enemy.breakGauge.yellow.max;
                    enemy.breakGauge.red.current = enemy.breakGauge.red.max;
                }
            }
        });
    }

    endTurn() {
        // Enemies act
        const damageToPlayer: Array<{ damage: number }> = [];
        this.enemies[this.wave.current].forEach((enemy) => {
            if (enemy.hp.current > 0 && !enemy.isBroken) {
                damageToPlayer.push({
                    damage: enemy.getHPDamage(this.player),
                });
            }
        });
        // Player takes damage
        damageToPlayer.forEach(({ damage }) => {
            this.player.takeDamage(damage);
        });
        this.damageToPlayer = damageToPlayer;
        // Reduce player and enemy effects, actions and reduce Job Change countdown
        this.enemies[this.wave.current].forEach((enemy) => enemy.reduceEffects());
        this.player.resetActions();
        this.player.countdownToJobChange -= 1;
        this.player.reduceEffects(this.player);
        this.player.reduceCooldowns();
    }

    tapAttack() {
        this.useAction();
        this.player.tapAttack();
        const targets = this.getTargets("single");
        const damageToEnemies: Array<DamageToEnemies> = [];
        targets.forEach((enemy) => {
            const hits = [];
            const numberOfHits = 1;
            for (let i = 0; i < numberOfHits; i++) {
                const [hp, critical] = this.player.getTapHPDamage(enemy);
                const yellow = this.player.getTapYellowGaugeDamage(enemy);
                const red = this.player.getTapRedGaugeDamage(enemy);
                hits.push({
                    damage: hp,
                    critical: critical,
                    broken: enemy.isBroken,
                });
                enemy.takeDamage({
                    hp: hp,
                    yellow: yellow,
                    red: red,
                });
            }
            damageToEnemies.push({
                enemyIndex: this.enemies[this.wave.current].indexOf(enemy),
                hits: hits,
            });
            if (enemy.hp.current === 0) {
                this.findNewTarget();
            }
        });
        this.damageToEnemies = damageToEnemies;
    }

    cardAbility(index: number) {
        const card = this.player.getMainCards()[index];
        // Empty card slot
        if (!card) {
            return;
        }
        // Action and orb reductions
        if (!card.extraSkills.includes(ExtraSkill.QuickCast)) {
            this.useAction();
        }
        // Ability cooldown
        if (card.ability.cooldown.max > 0) {
            let cooldown = card.ability.cooldown.max;
            if (card.extraSkills.includes(ExtraSkill.QuickRecast)) {
                const extraSkillCount = card.extraSkills.filter(
                    (extraSkill) => extraSkill === ExtraSkill.QuickRecast
                ).length;
                cooldown = Math.max(cooldown - extraSkillCount, 0);
            }
            card.ability.cooldown.current = cooldown;
        }
        this.player.addOrRemoveOrbs(card.element, card.ability.cost * -1);
        this.player.updateUltimateGauge(card.ability.cost);

        // Before attack Extra Skills
        if (card.extraSkills.includes(ExtraSkill.DurationBoost)) {
            // TODO: Ignore some Boons (e.g. Resist, Igninition, Cleaving)
            const boons = Object.values(Boon);
            this.player.effects
                .filter((effect) => boons.includes(effect.name as Boon))
                .forEach((effect) => {
                    effect.duration = Math.min(effect.duration + 1, 5);
                });
        }

        // Before attack effects
        this.addEffects(card.effect, "before", card);

        // Check if there is need to calculate damage
        if (card.ability.attack === 0 || card.ability.break === 0) {
            this.damageToEnemies = [];
        } else {
            const targets = this.getTargets(card.ability.target);
            const damageToEnemies: Array<DamageToEnemies> = [];
            targets.forEach((enemy) => {
                const hits = [];
                const numberOfHits = card.ability.hits;
                for (let i = 0; i < numberOfHits; i++) {
                    const [hp, critical] = this.player.getCardHPDamage(card, enemy);
                    const yellow = this.player.getCardYellowGaugeDamage(card, enemy);
                    const red = this.player.getCardRedGaugeDamage(card, enemy);
                    hits.push({
                        damage: hp,
                        critical: critical,
                        weakness: isWeakness(card.element, enemy.element),
                        broken: enemy.isBroken,
                    });
                    enemy.takeDamage({
                        hp: hp,
                        yellow: yellow,
                        red: red,
                    });
                }
                damageToEnemies.push({
                    enemyIndex: this.enemies[this.wave.current].indexOf(enemy),
                    hits: hits,
                });
                if (enemy.hp.current === 0) {
                    this.findNewTarget();
                }
            });
            this.damageToEnemies = damageToEnemies;
        }

        // After attack effects
        this.addEffects(card.effect, "after", card);
        if (card.element === "life") {
            let heal = 10;
            if (card.extraSkills.includes(ExtraSkill.EnhancedLife)) {
                heal += 10;
            }
            this.healToPlayer = [this.player.heal(0, heal)];
        }

        // After attack Extra Skills
        if (card.extraSkills.includes(ExtraSkill.ExtraLife)) {
            this.player.addOrRemoveOrbs("life", 1);
        }
        if (card.extraSkills.includes(ExtraSkill.ElementalRetrieval)) {
            this.player.drawOrbs(1);
        }
        if (card.extraSkills.includes(ExtraSkill.ElementalMirror) && card.element !== "life") {
            this.player.addResistElementEffect(card.element, card.ability.cost / 2);
        }
    }

    ultimate() {
        this.useAction();
        this.player.ultimate.current = 0;
        this.player.drawOrbs(10);
        const ultimate = this.player.getMainJob().ultimate;

        //Before effects
        this.addEffects(ultimate.effect, "before");

        // Damage
        // Calculate the base Attack and Break Power by reducing
        // the last hit proportion, if specified, from the base value
        let attack = ultimate.attack;
        let breakPower = ultimate.breakPower;
        let lastHitAttack = ultimate.lastHitAttack || attack;
        let lastHitBreakPower = ultimate.lastHitBreakPower || breakPower;
        if (lastHitAttack !== attack) {
            lastHitAttack = attack * lastHitAttack;
            attack -= lastHitAttack;
        }
        if (lastHitBreakPower !== breakPower) {
            lastHitBreakPower = breakPower * lastHitBreakPower;
            breakPower -= lastHitBreakPower;
        }
        const targets = this.getTargets(ultimate.target);
        const lastHitTargets = this.getTargets(ultimate.lastHitTarget || ultimate.target);
        const damageToEnemies: Array<DamageToEnemies> = [];

        // Normal hits
        targets.forEach((enemy) => {
            const hits = [];
            const numberOfHits = ultimate.hits - 1;
            for (let i = 0; i < numberOfHits; i++) {
                const [hp, critical] = this.player.getUltimateHPDamage(
                    attack / numberOfHits,
                    enemy
                );
                const yellow = this.player.getUltimateYellowGaugeDamage(
                    breakPower / numberOfHits,
                    enemy
                );
                const red = this.player.getUltimateYellowGaugeDamage(
                    breakPower / numberOfHits,
                    enemy
                );
                hits.push({
                    damage: hp,
                    critical: critical,
                    broken: enemy.isBroken,
                });
                enemy.takeDamage({
                    hp: hp,
                    yellow: yellow,
                    red: red,
                });
            }
            if (numberOfHits > 0) {
                damageToEnemies.push({
                    enemyIndex: this.enemies[this.wave.current].indexOf(enemy),
                    hits: hits,
                });
            }
        });

        // Last hit
        lastHitTargets.forEach((enemy) => {
            const hits = [];
            const [hp, critical] = this.player.getUltimateHPDamage(lastHitAttack, enemy);
            const yellow = this.player.getUltimateYellowGaugeDamage(lastHitBreakPower, enemy);
            const red = this.player.getUltimateYellowGaugeDamage(lastHitBreakPower, enemy);
            hits.push({
                damage: hp,
                critical: critical,
                broken: enemy.isBroken,
            });
            enemy.takeDamage({
                hp: hp,
                yellow: yellow,
                red: red,
            });

            const enemyIndex = damageToEnemies.findIndex(
                (x) => x.enemyIndex === this.enemies[this.wave.current].indexOf(enemy)
            );
            if (enemyIndex === -1) {
                damageToEnemies.push({
                    enemyIndex: this.enemies[this.wave.current].indexOf(enemy),
                    hits: hits,
                });
            } else {
                damageToEnemies[enemyIndex].hits.push(...hits);
            }
            if (enemy.hp.current === 0) {
                this.findNewTarget();
            }
        });
        this.damageToEnemies = damageToEnemies;

        //After effects
        this.addEffects(ultimate.effect, "after");
    }

    addEffects(effects: Array<Effect> | undefined, timing: "before" | "after", card?: BattleCard) {
        effects
            ?.filter((effect) => effect.timing === timing)
            .forEach((effect) => {
                if (card) {
                    if (
                        Object.values(Boon).includes(effect.name as Boon) &&
                        card.extraSkills.includes(ExtraSkill.EnhancedBoons)
                    ) {
                        effect.type = "hexagon";
                    }
                    if (
                        Object.values(Ailment).includes(effect.name as Ailment) &&
                        card.extraSkills.includes(ExtraSkill.EnhancedAilments)
                    ) {
                        effect.type = "hexagon";
                    }
                    if (
                        Object.values(Boon).includes(effect.name as Boon) &&
                        card.extraSkills.includes(ExtraSkill.LastingBoons)
                    ) {
                        effect.duration += 1;
                    }
                    if (
                        Object.values(Ailment).includes(effect.name as Ailment) &&
                        card.extraSkills.includes(ExtraSkill.LastingAilments)
                    ) {
                        effect.duration += 1;
                    }
                }
                switch (effect.target) {
                    case "self":
                        this.player.addEffect(effect, this.player);
                        break;
                    case "single":
                        const target = this.getTargets("single")[0];
                        target.addEffect(effect);
                        break;
                    case "area":
                        const targets = this.getTargets("area");
                        targets.forEach((target) => target.addEffect(effect));
                        break;
                }
            });
    }

    getTargets(targetType: Target): Array<EnemyActor> {
        const targets: Array<EnemyActor> = [];
        switch (targetType) {
            case "single":
                targets.push(this.enemies[this.wave.current][this.targetIndex]);
                break;
            case "cone":
                // Picks 3 targets: 1 from left, middle and right
                targets.push(this.enemies[this.wave.current][this.targetIndex]);
                if (
                    this.enemies[this.wave.current][this.targetIndex - 1] &&
                    this.enemies[this.wave.current][this.targetIndex - 1].hp.current > 0
                ) {
                    targets.push(this.enemies[this.wave.current][this.targetIndex - 1]);
                }
                if (
                    this.enemies[this.wave.current][this.targetIndex + 1] &&
                    this.enemies[this.wave.current][this.targetIndex + 1].hp.current > 0
                ) {
                    targets.push(this.enemies[this.wave.current][this.targetIndex + 1]);
                }
                break;
            case "area":
                this.enemies[this.wave.current].forEach((enemy) => {
                    if (enemy.hp.current > 0) {
                        targets.push(enemy);
                    }
                });
                break;
        }
        return targets;
    }

    findNewTarget() {
        // 1. Check the enemy on the left
        // 2. Check the enemy on the right
        // 3. Go though every enemy of the current wave and see if any of them have HP left
        // Index set to -1 if no valid enemies are found
        if (this.enemies[this.wave.current][this.targetIndex - 1]?.hp.current > 0) {
            this.targetIndex -= 1;
        } else if (this.enemies[this.wave.current][this.targetIndex + 1]?.hp.current > 0) {
            this.targetIndex += 1;
        } else {
            let enemiesAlive = false;
            this.enemies[this.wave.current].forEach((enemy, index) => {
                if (enemy.hp.current > 0) {
                    this.targetIndex = index;
                    enemiesAlive = true;
                }
            });
            if (!enemiesAlive) {
                this.targetIndex = -1;
            }
        }
    }
}

export default Battle;
export type { BattleInput };
