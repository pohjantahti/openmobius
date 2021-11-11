import { JobType } from "../../data/game/jobs";
import { resources } from "../../extractor";
import { MAX } from "../../info";
import { capitalize } from "../../utils";

interface Props {
    info: JobType;
}

function JobThumbnail(props: Props) {
    const { info } = props;
    const overboostTextShadow = info.overboost === MAX.jobOverboost ? "#F6CA1F" : "#000000";
    return (
        <div
            style={{
                position: "relative",
                height: "7.8rem",
                width: "7.8rem",
            }}
        >
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
                src={resources["Icon: CardThumbnailDecorationRainbow"]}
                style={{
                    position: "absolute",
                    height: "inherit",
                }}
            />
            {/* Level */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "2%",
                    display: "flex",
                }}
            >
                <img
                    src={resources["Icon: JobThumbnailCrown"]}
                    style={{
                        height: "3rem",
                        filter: "saturate(200%)",
                        marginRight: "-0.4rem",
                    }}
                />
                <p
                    style={{
                        fontSize: "1.3rem",
                        lineHeight: "1.3rem",
                        color: "#FFFFFF",
                        textShadow: "-1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000",
                        marginTop: "1.3rem",
                        zIndex: 1,
                    }}
                >
                    x{info.level}
                </p>
            </div>
            {/* Overboost */}
            {info.overboost > 0 && (
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
                            textShadow: `-1px 0 ${overboostTextShadow}, 0 1px ${overboostTextShadow}, 1px 0 ${overboostTextShadow}, 0 -1px ${overboostTextShadow}`,
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
                            textShadow: `-1px 0 ${overboostTextShadow}, 0 1px ${overboostTextShadow}, 1px 0 ${overboostTextShadow}, 0 -1px ${overboostTextShadow}`,
                        }}
                    >
                        {info.overboost}
                    </p>
                </div>
            )}
            {/* Class */}
            <img
                src={resources[`Icon: ${capitalize(info.class)}_Bordered`]}
                style={{
                    position: "absolute",
                    height: "25%",
                    bottom: "1%",
                    right: "1%",
                }}
            />
        </div>
    );
}

export default JobThumbnail;
