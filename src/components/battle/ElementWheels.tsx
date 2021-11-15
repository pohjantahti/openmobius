import { resources } from "../../extractor";
import { Element } from "../../info/types";

interface Props {
    elementWheel: {
        elements: {
            main: [Element, Element, Element];
            sub: [Element, Element, Element];
        };
        wheel: [number, number, number];
    };
}

function ElementWheels(props: Props) {
    const { elements, wheel } = props.elementWheel;

    const animationSpeed = 0.5;

    const subWheel = [100 / 3 + 2, 100 / 3, 100 / 3];

    const elementColor: Record<Element, string> = {
        fire: "#DF0909",
        water: "#1092E6",
        wind: "#00D200",
        earth: "#D7840C",
        light: "#CFD47A",
        dark: "#5A03CC",
    };

    if (wheel[0] > 0) {
        wheel[0] += 2;
    } else if (wheel[1] > 0) {
        wheel[1] += 2;
    } else if (wheel[2] > 0) {
        wheel[2] += 2;
    }

    return (
        <>
            {/* Current job element wheel */}
            <svg
                viewBox="0 0 32 32"
                style={{
                    position: "absolute",
                    bottom: "4.9rem",
                    right: "4.2rem",
                    height: "10.2rem",
                    borderRadius: "50%",
                    transform: "rotate(-90deg)",
                }}
            >
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: "cyan",
                        strokeDasharray: "100 100",
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.main[0]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${wheel[0] + wheel[1] + wheel[2]} 100`,
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.main[1]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${wheel[1] + wheel[2]} 100`,
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.main[2]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${wheel[2]} 100`,
                    }}
                ></circle>
            </svg>
            <img
                src={resources["Icon: Battle_ElementWheelInner"]}
                style={{
                    position: "absolute",
                    bottom: "6.45rem",
                    right: "5.7rem",
                    height: "7.2rem",
                    opacity: 0.5,
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelCover"]}
                style={{
                    position: "absolute",
                    bottom: "4.9rem",
                    right: "4.2rem",
                    height: "10.3rem",
                    opacity: 0.7,
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelSpinningCover"]}
                style={{
                    position: "absolute",
                    bottom: "4.9rem",
                    right: "4.2rem",
                    height: "10.3rem",
                    opacity: 0.5,
                    animation: "spinLeft 30s linear infinite",
                }}
            />

            {/* Job change wheel element wheel */}
            <svg
                viewBox="0 0 32 32"
                style={{
                    position: "absolute",
                    bottom: "2.9rem",
                    left: "1.7rem",
                    height: "10rem",
                    borderRadius: "50%",
                    transform: "rotate(-90deg)",
                    opacity: 1,
                }}
            >
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: "cyan",
                        strokeDasharray: "100 100",
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.sub[0]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${subWheel[0] + subWheel[1] + subWheel[2]} 100`,
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.sub[1]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${subWheel[1] + subWheel[2]} 100`,
                    }}
                ></circle>
                <circle
                    r="16"
                    cx="16"
                    cy="16"
                    style={{
                        fill: "none",
                        strokeWidth: 8,
                        stroke: elementColor[elements.sub[2]],
                        transition: `stroke-dasharray ${animationSpeed}s`,
                        strokeDasharray: `${subWheel[2]} 100`,
                    }}
                ></circle>
            </svg>
            <img
                src={resources["Icon: Battle_ElementWheelInner"]}
                style={{
                    position: "absolute",
                    bottom: "4.4rem",
                    left: "3rem",
                    height: "7.2rem",
                    opacity: 0.5,
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelCover"]}
                style={{
                    position: "absolute",
                    bottom: "2.7rem",
                    left: "1.5rem",
                    height: "10.3rem",
                    opacity: 0.7,
                }}
            />
            <img
                src={resources["Icon: Battle_ElementWheelSpinningCover"]}
                style={{
                    position: "absolute",
                    bottom: "2.7rem",
                    left: "1.5rem",
                    height: "10.3rem",
                    opacity: 0.5,
                    animation: "spinLeft 30s linear infinite",
                }}
            />
            {/* Darken job change wheel when job change unavailable */}
            <div
                style={{
                    position: "absolute",
                    height: "10.3rem",
                    width: "10.3rem",
                    bottom: "2.8rem",
                    left: "1.6rem",
                    backgroundColor: "black",
                    opacity: 0.5,
                    borderRadius: "5rem",
                }}
            />
        </>
    );
}

export default ElementWheels;
