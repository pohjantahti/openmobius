import { resources } from "../../extractor";

function BackgroundImages() {
    return (
        <>
            <img
                src={resources["Icon: Battle_BattleInfoBackground"]}
                style={{
                    position: "absolute",
                    top: "-0.9rem",
                    left: 0,
                    height: "11rem",
                }}
            />
            <img
                src={resources["Icon: Battle_OrbBarBackgroundS1"]}
                style={{
                    position: "absolute",
                    top: "2rem",
                    left: "64rem",
                    height: "5.2rem",
                }}
            />

            <img
                src={resources["Icon: Battle_HelpButtonBackground"]}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "7.5rem",
                }}
            />

            <img
                src={resources["Icon: Battle_BottomHighlight"]}
                style={{
                    position: "absolute",
                    bottom: "0.2rem",
                    right: "0.1rem",
                    height: "21.5rem",
                    // filter: `url(#${element}Filter)`,
                    opacity: 0.6,
                }}
            />
            <img
                src={resources["Icon: Battle_BottomBackground"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: "21.4rem",
                }}
            />

            <img
                src={resources["Icon: Battle_ElementWheelElementSpike"]}
                style={{
                    position: "absolute",
                    bottom: "15rem",
                    right: "5.8rem",
                    height: "2.6rem",
                    width: "1.24rem",
                    transform: "rotate(15deg)",
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelElementSpike"]}
                style={{
                    position: "absolute",
                    bottom: "15.4rem",
                    right: "9.9rem",
                    height: "2.6rem",
                    width: "1.24rem",
                    transform: "rotate(-13deg)",
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelElementSpike"]}
                style={{
                    position: "absolute",
                    bottom: "13.7rem",
                    right: "13.2rem",
                    height: "2.6rem",
                    width: "1.24rem",
                    transform: "rotate(-38deg)",
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelElementSpike"]}
                style={{
                    position: "absolute",
                    bottom: "10.7rem",
                    right: "15rem",
                    height: "2.6rem",
                    width: "1.24rem",
                    transform: "rotate(-65deg)",
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelUltimateSpike"]}
                style={{
                    position: "absolute",
                    bottom: "6.7rem",
                    right: "14rem",
                    height: "2rem",
                }}
            />

            <img
                src={resources["Icon: Battle_JobChangeBackground"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "17.22rem",
                }}
            />

            <img
                src={resources["Icon: Battle_CardAreaBackground"]}
                style={{
                    position: "absolute",
                    top: "13.5rem",
                    right: 0,
                    height: "30rem",
                }}
            />
        </>
    );
}

export default BackgroundImages;
