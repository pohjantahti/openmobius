import { resources } from "../../../extractor";
import { JobClass } from "../../../info/types";
import { capitalize } from "@utils";

interface Props {
    actions: number;
    jobClass: JobClass;
}

function TurnBar(props: Props) {
    const { actions, jobClass } = props;

    return (
        <div
            style={{
                position: "absolute",
                bottom: "12.6rem",
                right: "17rem",
            }}
        >
            <img
                src={resources["Icon: Battle_TurnBackground_Left"]}
                style={{
                    height: "2.8rem",
                }}
            />
            <img
                src={resources["Icon: Battle_TurnBackground_Middle"]}
                style={{
                    height: "2.8rem",
                    width: "1.8rem",
                }}
            />
            <img
                src={resources["Icon: Battle_TurnBackground_Right"]}
                style={{
                    height: "2.8rem",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: "4rem",
                    top: "-0.7rem",
                    left: "0.5rem",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <p
                    style={{
                        fontSize: "1.9rem",
                        color: "#FFFFFF",
                        filter: "url(#blackOutlineFilter)",
                    }}
                >
                    {actions}
                </p>
            </div>

            <img
                src={resources[`Icon: ${capitalize(jobClass)}`]}
                style={{
                    position: "absolute",
                    height: "2.8rem",
                    left: "-2.8rem",
                }}
            />
            <p
                style={{
                    position: "absolute",
                    top: "-0.2rem",
                    left: "-0.2rem",
                    fontSize: "1.6rem",
                    color: "#FFFFFF",
                    filter: "url(#blackOutlineFilter)",
                }}
            >
                x
            </p>
        </div>
    );
}

export default TurnBar;
