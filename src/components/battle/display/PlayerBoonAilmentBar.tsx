import { Effect } from "../../../battle/types";
import { resources } from "../../../extractor";
import { capitalize } from "../../../utils";

interface Props {
    playerEffects: Array<Effect>;
}

function PlayerBoonAilmentBar(props: Props) {
    const { playerEffects } = props;
    return (
        <div
            style={{
                position: "absolute",
                bottom: "13rem",
                right: "25rem",
                height: "4rem",
                maxWidth: "50rem",
                display: "flex",
                flexDirection: "row-reverse",
            }}
        >
            {playerEffects.map((effect, index) => (
                <div
                    key={index}
                    style={{
                        width: "3.5rem",
                        marginRight: "0.5rem",
                        display: effect.duration > 0 ? "inline" : "none",
                    }}
                >
                    <img
                        src={
                            resources[`Icon: ${capitalize(effect.name)}_${capitalize(effect.type)}`]
                        }
                        style={{
                            position: "absolute",
                            height: "3.9rem",
                        }}
                    />
                    <p
                        style={{
                            position: "absolute",
                            top: "-0.7rem",
                            fontSize: "1.3rem",
                            color: "#FFFFFF",
                            filter: "url(#thinBlackOutlineFilter)",
                        }}
                    >
                        {effect.duration}
                    </p>
                </div>
            ))}
        </div>
    );
}
export default PlayerBoonAilmentBar;
