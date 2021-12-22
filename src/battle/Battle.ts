import { Enemy } from "../data/game/enemies";
import { FullDeck, Target } from "../info/types";
import EnemyActor from "./EnemyActor";
import PlayerActor from "./PlayerActor";
import { BattleAction, BattleInfo, ExtraSkill } from "./types";
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
    damageToEnemies: Array<{
        enemyIndex: number;
        hits: Array<{
            damage: number;
            critical?: boolean;
            weakness?: boolean;
            broken?: boolean;
        }>;
    }>;
    isBattleCompleted: boolean;
    damageToPlayer: Array<{
        damage: number;
    }>;

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
                name: "Ultimate name",
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
                this.player.driveElement(index!);
                break;
        }
        console.log("ACTION", action, index);
    }

    waveCompleted() {
        console.log("Wave completed", this.wave.current, this.wave.max);
        this.player.countdownToJobChange -= 1;
        this.player.reduceEffects();

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
        this.player.reduceEffects();
    }

    tapAttack() {
        this.useAction();
        this.player.tapAttack();
        const targets = this.getTargets("single");
        const damageToEnemies: Array<{
            enemyIndex: number;
            hits: Array<{
                damage: number;
                critical?: boolean;
                weakness?: boolean;
                broken?: boolean;
            }>;
        }> = [];
        targets.forEach((enemy) => {
            const hits = [];
            const numberOfHits = 1;
            for (let i = 0; i < numberOfHits; i++) {
                const hp = this.player.getTapHPDamage(enemy);
                const yellow = this.player.getTapYellowGaugeDamage(enemy);
                const red = this.player.getTapRedGaugeDamage(enemy);
                hits.push({
                    damage: hp,
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
        this.player.updateOrbs(card.element, card.ability.cost * -1);

        // Before attack effects
        card.effect
            ?.filter((effect) => effect.timing === "before")
            .forEach((effect) => {
                switch (effect.target) {
                    case "self":
                        this.player.addEffect(effect);
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

        // Check if there is need to calculate damage
        if (card.ability.attack === 0 || card.ability.break === 0) {
            this.damageToEnemies = [];
        } else {
            const targets = this.getTargets(card.ability.target);
            const damageToEnemies: Array<{
                enemyIndex: number;
                hits: Array<{
                    damage: number;
                    critical?: boolean;
                    weakness?: boolean;
                    broken?: boolean;
                }>;
            }> = [];
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
                        weakness: isWeakness(card, enemy),
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
        card.effect
            ?.filter((effect) => effect.timing === "after")
            .forEach((effect) => {
                switch (effect.target) {
                    case "self":
                        this.player.addEffect(effect);
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
        // After attack Extra Skills
        if (card.extraSkills.includes(ExtraSkill.ElementalRetrieval)) {
            this.player.updateOrbs(this.player.getRandomOrbFromElementWheel(), 1);
        }
        if (card.extraSkills.includes(ExtraSkill.ElementalMirror) && card.element !== "life") {
            this.player.addResistElementEffect(card.element, 1);
        }
    }

    getTargets(targetType: Target): Array<EnemyActor> {
        const targets: Array<EnemyActor> = [];
        switch (targetType) {
            case "single":
                targets.push(this.enemies[this.wave.current][this.targetIndex]);
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
