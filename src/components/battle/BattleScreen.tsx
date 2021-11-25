import { useEffect, useState } from "react";
import { battle, initBattle } from "../../battle";
import { currentDeck, deckInfo, playerInfo } from "../../info";
import BackgroundImages from "./BackgroundImages";
import DisplayData from "./display/DisplayData";
import Buttons from "./button/Buttons";
import EnemyCards from "./EnemyCards";
import PlayerCard from "./PlayerCard";
import { Enemy } from "../../data/game/enemies";
import { BattleAction, BattleInfo } from "../../battle/types";
import { sleep } from "../../utils";

interface Props {
    combatInProgress: boolean;
    handleCombatEnd: () => void;
    battleNodeInfo: { waves: number; enemies: Array<Array<Enemy>> };
}

function BattleScreen(props: Props) {
    const { combatInProgress, handleCombatEnd, battleNodeInfo } = props;

    const [battleInfo, setBattleInfo] = useState<BattleInfo>(Object());
    const [changingTarget, setChangingTarget] = useState(false);
    const [turnEnding, setTurnEnding] = useState(false);
    const [waveEnding, setWaveEnding] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [playerMoving, setPlayerMoving] = useState(false);
    const [enemiesMoving, setEnemiesMoving] = useState(false);

    useEffect(() => {
        initBattle({
            deck: deckInfo[currentDeck],
            waves: battleNodeInfo.waves,
            ultimate: playerInfo.ultimate,
            enemies: battleNodeInfo.enemies,
        });
        setBattleInfo(battle.getBattleInfo());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleTurnEnd = async () => {
            await sleep(1500);
            battle.endTurn();
            setBattleInfo(battle.getBattleInfo());
            setEnemiesMoving(true);
            await sleep(1000);
            setEnemiesMoving(false);
            setTurnEnding(false);
        };
        const handleWaveEnd = async () => {
            battle.waveCompleted();
            await sleep(1000);
            const info = battle.getBattleInfo();
            if (info.isBattleCompleted) {
                handleCombatEnd();
            } else {
                setBattleInfo(info);
            }
            setWaveEnding(false);
        };

        if (battleInfo.targetIndex === -1 && !waveEnding) {
            setWaveEnding(true);
            handleWaveEnd();
        }
        if (battleInfo.actions === 0 && !turnEnding) {
            setTurnEnding(true);
            handleTurnEnd();
        }
    }, [battleInfo]); // eslint-disable-line react-hooks/exhaustive-deps

    // This is needed till the first time setBattleInfo is called in useEffect
    if (Object.keys(battleInfo).length === 0) {
        return null;
    }

    const handleBattleAction = async (action: BattleAction, index?: number) => {
        if (actionInProgress) {
            return;
        }
        setActionInProgress(true);
        if (action !== BattleAction.ChangeTarget) {
            setChangingTarget(false);
        }
        switch (action) {
            case BattleAction.Help:
            case BattleAction.TargetView:
                setChangingTarget(!changingTarget);
                break;
            case BattleAction.ChangeTarget:
                battle.action(action, index);
                break;
            case BattleAction.Auto:
                console.log(action.toUpperCase(), "clicked");
                break;
            default:
                battle.action(action, index);
                break;
        }
        setBattleInfo(battle.getBattleInfo());
        await handleActionInProgress(action);
        setPlayerMoving(false);
        setActionInProgress(false);
    };

    const handleActionInProgress = async (action: BattleAction) => {
        let actionLockTime = 0;
        switch (action) {
            case BattleAction.Tap:
                actionLockTime = 1000;
                setPlayerMoving(true);
                break;
            case BattleAction.Card:
                actionLockTime = 1000;
                setPlayerMoving(true);
                break;
            case BattleAction.Ultimate:
                actionLockTime = 1000;
                setPlayerMoving(true);
                break;
        }
        await sleep(actionLockTime);
    };

    const showCards = [false, false, false, false];
    battleInfo.cards.forEach((card, index) => {
        showCards[index] = Boolean(
            !actionInProgress &&
                !turnEnding &&
                !waveEnding &&
                card &&
                battleInfo.orbs[card.element] >= card.ability.cost
        );
    });

    return (
        <div
            style={{
                display: combatInProgress ? "inline" : "none",
                height: "100%",
                width: "100%",
            }}
        >
            <BackgroundImages />

            <Buttons
                handleBattleAction={handleBattleAction}
                elements={battleInfo.elements.main}
                orbs={battleInfo.orbs}
                ultimate={battleInfo.ultimate}
                showCards={showCards}
                cards={battleInfo.cards}
                countdownToJobChange={battleInfo.countdownToJobChange}
                changingTarget={changingTarget}
            />

            <DisplayData
                elements={battleInfo.elements}
                elementWheel={battleInfo.elementWheel}
                score={battleInfo.score}
                wave={battleInfo.wave}
                hp={battleInfo.hp}
                ultimateGauge={battleInfo.ultimate.gauge}
                orbs={battleInfo.orbs}
                actions={battleInfo.actions}
                jobClass={battleInfo.jobClass}
                countdownToJobChange={battleInfo.countdownToJobChange}
                playerEffects={battleInfo.playerEffects}
            />

            <EnemyCards
                enemies={battleInfo.enemies}
                targetIndex={battleInfo.targetIndex}
                handleBattleAction={handleBattleAction}
                damageToEnemies={battleInfo.damageToEnemies}
                changingTarget={changingTarget}
                enemiesMoving={enemiesMoving}
            />
            <PlayerCard
                playerCard={battleInfo.playerCard}
                damageToPlayer={battleInfo.damageToPlayer}
                playerMoving={playerMoving}
            />

            <button
                style={{
                    position: "absolute",
                    top: "65rem",
                    left: "82.5rem",
                }}
                onClick={handleCombatEnd}
            >
                End combat
            </button>
        </div>
    );
}

export default BattleScreen;
