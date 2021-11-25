import { useState, useEffect } from "react";
import { resources } from "../../extractor";
import { sleep } from "../../utils";

interface Props {
    damage: number;
    broken: boolean;
}

function DamageTextNumber(props: Props) {
    const [damageNumber, setDamageNumber] = useState(0);
    const steps = 5;
    // Margins for different number images in order
    const imageMarginTop = [
        "0rem",
        "0rem",
        "0.1rem",
        "0.5rem",
        "0.5rem",
        "0.7rem",
        "-0.7rem",
        "0.6rem",
        "-0.8rem",
        "0.5rem",
    ];

    useEffect(() => {
        // Used to make the "running number" happen
        // Starts from half and keeps adding to it each cycle
        const animateNumber = async (dmg: number) => {
            let dmgNumber = Math.floor(dmg / 2);
            setDamageNumber(dmgNumber);
            for (let i = 0; i < steps; i++) {
                await sleep(50);
                dmgNumber = Math.floor(dmgNumber + dmg / 2 / steps);
                setDamageNumber(dmgNumber);
            }
            setDamageNumber(dmg);
        };
        animateNumber(props.damage);
        return () => {
            setDamageNumber(0);
        };
    }, [props]);

    return (
        <>
            {damageNumber
                .toString()
                .split("")
                .map((hitNumber, index, array) => (
                    <img
                        key={index}
                        src={resources[`Icon: Battle_Number${hitNumber}`]}
                        style={{
                            height: "5rem",
                            marginRight: "-1.8rem",
                            marginTop: imageMarginTop[Number(hitNumber)],
                            zIndex: array.length - index,
                            filter: props.broken ? "url(#brokenDamageTextFilter)" : "none",
                        }}
                    />
                ))}
        </>
    );
}

export default DamageTextNumber;
