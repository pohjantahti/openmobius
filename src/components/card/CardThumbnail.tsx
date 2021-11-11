import { CardType } from "../../data/game/cards";
import { resources } from "../../extractor";
import { MAX } from "../../info";
import { capitalize } from "../../utils";

interface Props {
    info: CardType | undefined;
}

function CardThumbnail(props: Props) {
    const { info } = props;
    const levelTextShadow = info && info.level === MAX.cardLevel ? "#F6CA1F" : "#000000";
    const overboostTextShadow =
        info && info.overboost === MAX.cardOverboost ? "#F6CA1F" : "#000000";

    return (
        <div
            style={{
                position: "relative",
                height: "7.8rem",
                width: "7.8rem",
            }}
        >
            {info && (
                <>
                    {/* Thumbnail */}
                    <img
                        src={resources[info.thumbnail]}
                        style={{
                            position: "absolute",
                            height: "inherit",
                            borderRadius: "0.8rem",
                        }}
                    />
                    {/* Border */}
                    <img
                        src={resources["Icon: CardThumbnailDecoration5*"]}
                        style={{
                            position: "absolute",
                            height: "inherit",
                            filter: `url(#${info.element}Filter)`,
                        }}
                    />
                    {/* Element */}
                    <img
                        src={resources[`Icon: ${capitalize(info.element)}OrbBordered`]}
                        style={{
                            position: "absolute",
                            height: "25%",
                            top: "1%",
                            left: "1%",
                        }}
                    />
                    {/* Level */}
                    <div
                        style={{
                            position: "absolute",
                            top: "1%",
                            right: "4%",
                            display: "flex",
                            justifyContent: "space-between",
                            width: "60%",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "1.2rem",
                                lineHeight: "1.2rem",
                                color: "#FFFFFF",
                                textShadow: `-1px 0 ${levelTextShadow}, 0 1px ${levelTextShadow}, 1px 0 ${levelTextShadow}, 0 -1px ${levelTextShadow}`,
                                marginBottom: "0.3rem",
                            }}
                        >
                            Lv.
                        </p>
                        <p
                            style={{
                                fontSize: "1.5rem",
                                lineHeight: "1.5rem",
                                color: "#FFFFFF",
                                textShadow: `-1px 0 ${levelTextShadow}, 0 1px ${levelTextShadow}, 1px 0 ${levelTextShadow}, 0 -1px ${levelTextShadow}`,
                            }}
                        >
                            {info.level + info.overboost}
                        </p>
                    </div>
                    {/* Overboost */}
                    {info.overboost > 0 && (
                        <p
                            style={{
                                position: "absolute",
                                top: "22%",
                                right: "4%",
                                fontSize: "1.2rem",
                                lineHeight: "1.2rem",
                                color: "#FFFFFF",
                                textShadow: `-1px 0 ${overboostTextShadow}, 0 1px ${overboostTextShadow}, 1px 0 ${overboostTextShadow}, 0 -1px ${overboostTextShadow}`,
                            }}
                        >
                            (+{info.overboost})
                        </p>
                    )}
                    {/* Class */}
                    <img
                        src={resources[`Icon: ${capitalize(info.class)}_Bordered`]}
                        style={{
                            position: "absolute",
                            height: "25%",
                            bottom: "1%",
                            right: "2%",
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default CardThumbnail;
