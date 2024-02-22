import { resources } from "../../../extractor";
import { FullElement } from "../../../info/types";
import { capitalize } from "@utils";

interface Props {
    orbs: Record<FullElement, number>;
}

function OrbBar(props: Props) {
    const { orbs } = props;
    const orbTypes = Object.keys(orbs) as Array<FullElement>;
    const orbList = [];
    for (let i = 0; i < orbTypes.length; i++) {
        for (let j = 0; j < orbs[orbTypes[i]]; j++) {
            orbList.push(orbTypes[i]);
        }
    }
    return (
        <div
            style={{
                position: "absolute",
                height: "3.33rem",
                width: "52rem",
                top: "1.5rem",
                left: "66rem",
            }}
        >
            {orbList.map((orb, index) => (
                <img
                    key={index}
                    style={{
                        height: "100%",
                        marginLeft: "-0.2rem",
                    }}
                    src={resources[`Icon: ${capitalize(orb)}Orb`]}
                />
            ))}
        </div>
    );
}
export default OrbBar;
