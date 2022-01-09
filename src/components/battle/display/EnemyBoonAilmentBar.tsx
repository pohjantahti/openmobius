import { BattleEffect } from "../../../battle/types";
import { resources } from "../../../extractor";
import { capitalize } from "../../../utils";

interface Props {
    effects: Array<BattleEffect>;
}

function EnemyBoonAilmentBar(props: Props) {
    const { effects } = props;
    return (
        <div
            style={{
                position: "absolute",
                top: "-2.2rem",
                height: "3rem",
                width: "100%",
                display: "flex",
                flexDirection: "row-reverse",
            }}
        >
            {effects.map((effect, index) => (
                <div
                    key={index}
                    style={{
                        width: "2.5rem",
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
                            height: "2.9rem",
                        }}
                    />
                    <p
                        style={{
                            position: "absolute",
                            top: "-0.7rem",
                            fontSize: "1rem",
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
export default EnemyBoonAilmentBar;
