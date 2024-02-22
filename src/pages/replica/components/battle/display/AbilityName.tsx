import { useEffect, useState } from "react";
import { resources } from "../../../extractor";
import { sleep } from "@utils";

interface Props {
    abilityName: string;
}

function AbilityName(props: Props) {
    const { abilityName } = props;
    const [opacity, setOpacity] = useState(0);
    const [animationInProgress, setAnimationInProgress] = useState(false);

    const setAnimation = async () => {
        setAnimationInProgress(true);
        setOpacity(1);
        await sleep(800);
        setOpacity(0);
        await sleep(200);
        setAnimationInProgress(false);
    };

    useEffect(() => {
        if (!animationInProgress && props.abilityName && props.abilityName.length > 0) {
            setAnimation();
        }
        // Including animationInProgress would create an infinite loop
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            style={{
                opacity: opacity,
                position: "absolute",
                bottom: "22rem",
                right: "45rem",
                transition: "opacity 0.2s linear",
            }}
        >
            <img
                src={resources["Icon: Battle_AbilityNameBackground"]}
                style={{
                    height: "3.6rem",
                    position: "absolute",
                }}
            />
            <p
                style={{
                    fontSize: "2rem",
                    color: "#000000",
                    filter: "url(#whiteOutlineFilter)",
                    position: "absolute",
                    top: "-0.4rem",
                    left: "3rem",
                    width: "40rem",
                }}
            >
                {abilityName}
            </p>
        </div>
    );
}

export default AbilityName;
