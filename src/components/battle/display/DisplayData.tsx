import { Element, FullElement, JobClass } from "../../../info/types";
import PlayerBoonAilmentBar from "./PlayerBoonAilmentBar";
import ElementWheels from "./ElementWheels";
import HPBar from "./HPBar";
import OrbBar from "./OrbBar";
import ScoreWaveBar from "./ScoreWaveBar";
import TurnBar from "./TurnBar";
import UltimateBar from "./UltimateBar";
import { BattleEffect } from "../../../battle/types";

interface Props {
    elements: {
        main: [Element, Element, Element];
        sub: [Element, Element, Element];
    };
    elementWheel: [number, number, number];
    score: number;
    wave: {
        current: number;
        max: number;
    };
    hp: {
        main: {
            current: number;
            max: number;
        };
        sub?: {
            current: number;
            max: number;
        };
    };
    ultimateGauge: {
        current: number;
        max: number;
    };
    orbs: Record<FullElement, number>;
    actions: number;
    jobClass: JobClass;
    countdownToJobChange: number;
    playerEffects: Array<BattleEffect>;
}

function DisplayData(props: Props) {
    const {
        elements,
        elementWheel,
        score,
        wave,
        hp,
        ultimateGauge,
        orbs,
        actions,
        jobClass,
        countdownToJobChange,
        playerEffects,
    } = props;
    return (
        <>
            <ElementWheels
                elements={elements}
                elementWheel={elementWheel}
                countdownToJobChange={countdownToJobChange}
            />
            <ScoreWaveBar score={score} wave={wave} />
            <HPBar hp={hp} />
            <UltimateBar ultimateGauge={ultimateGauge} />
            <OrbBar orbs={orbs} />
            <TurnBar actions={actions} jobClass={jobClass} />
            <PlayerBoonAilmentBar playerEffects={playerEffects} />
        </>
    );
}

export default DisplayData;
