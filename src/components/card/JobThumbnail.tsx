import { Job } from "../../data/game/jobs";
import { resources } from "../../extractor";
import { MAX } from "../../info";
import { capitalize } from "../../utils";

interface Props {
    info: Job;
}

function JobThumbnail(props: Props) {
    const { info } = props;
    const overboostTextShadow = info.overboost === MAX.jobOverboost ? "#F6CA1F" : "#000000";
    return (
        <div
            style={{
                position: "relative",
                height: "96%",
                width: "96%",
            }}
        >
            {/* Thumbnail */}
            <img
                src={resources[info.resources.thumbnail]}
                style={{
                    position: "absolute",
                    height: "inherit",
                    borderRadius: "0.8rem",
                }}
            />
            {/* Border */}
            <img
                src={resources["Icon: CardThumbnail_DecorationRainbow"]}
                style={{
                    position: "absolute",
                    height: "inherit",
                }}
            />
            {/* Level */}
            <div
                style={{
                    position: "absolute",
                    bottom: "2%",
                    left: "1%",
                    display: "flex",
                }}
            >
                <img
                    src={resources["Icon: JobThumbnailCrown"]}
                    style={{
                        height: "3rem",
                        filter: "saturate(200%)",
                        marginRight: "-4%",
                    }}
                />
                <p
                    style={{
                        fontSize: "1.3rem",
                        lineHeight: "1.3rem",
                        color: "#FFFFFF",
                        textShadow: "-1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000",
                        marginTop: "24%",
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
                        top: "1.5%",
                        right: "8%",
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
                            marginTop: "5%",
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
                    bottom: "5%",
                    right: "5%",
                }}
            />
        </div>
    );
}

export default JobThumbnail;
