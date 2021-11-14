import { resources } from "../../extractor";
import { playerInfo } from "../../info";
import { padNumberWithZeroes } from "../../utils";

interface SkillseedProps {
    element: string;
    textColor: string;
    textShadow: string;
    count: number;
}

function SkillseedInfo() {
    // TODO: Smaller version for Skill Card and Boost Weapon pages

    const Skillseed = (props: SkillseedProps) => {
        const { element, textColor, textShadow, count } = props;

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "1.4rem",
                        lineHeight: "2.3rem",
                        color: textColor,
                        textShadow: `-1px 0 ${textShadow}, 0 1px ${textShadow}, 1px 0 ${textShadow}, 0 -1px ${textShadow}`,
                    }}
                >
                    {element}
                </p>
                <img
                    src={
                        resources[
                            element === "Crystals"
                                ? "Icon: Crystal"
                                : `Icon: ${element}Skillseed_Small`
                        ]
                    }
                    style={{
                        height: "2.4rem",
                        margin: "0rem 0.18rem 0 1rem",
                    }}
                />
                <p
                    style={{
                        margin: 0,
                        fontSize: "1.6rem",
                        lineHeight: "2.3rem",
                        color: textColor,
                        textShadow: `-1px 0 ${textShadow}, 0 1px ${textShadow}, 1px 0 ${textShadow}, 0 -1px ${textShadow}`,
                    }}
                >
                    {padNumberWithZeroes(count, 7)}
                </p>
            </div>
        );
    };

    return (
        <div
            style={{
                display: "flex",
                paddingTop: "0.2rem",
            }}
        >
            <div
                style={{
                    width: "20.84rem",
                    textAlign: "end",
                    marginRight: "0.89rem",
                }}
            >
                <Skillseed
                    element="Fire"
                    textColor="#FFF3EF"
                    textShadow="#8B5742"
                    count={playerInfo.skillseeds.fire}
                />
                <Skillseed
                    element="Wind"
                    textColor="#DCFFEF"
                    textShadow="#309B4B"
                    count={playerInfo.skillseeds.wind}
                />
                <Skillseed
                    element="Light"
                    textColor="#FEFFD2"
                    textShadow="#7B8626"
                    count={playerInfo.skillseeds.light}
                />
            </div>
            <div
                style={{
                    width: "20.84rem",
                    textAlign: "end",
                    marginRight: "0.89rem",
                }}
            >
                <Skillseed
                    element="Water"
                    textColor="#E6FFFF"
                    textShadow="#387685"
                    count={playerInfo.skillseeds.water}
                />
                <Skillseed
                    element="Earth"
                    textColor="#FFF3C8"
                    textShadow="#7D5E1D"
                    count={playerInfo.skillseeds.earth}
                />
                <Skillseed
                    element="Dark"
                    textColor="#FDF1FF"
                    textShadow="#5B5778"
                    count={playerInfo.skillseeds.dark}
                />
                <Skillseed
                    element="Crystals"
                    textColor="#EDFFFF"
                    textShadow="#508772"
                    count={playerInfo.skillseeds.dark}
                />
            </div>
        </div>
    );
}

export default SkillseedInfo;
