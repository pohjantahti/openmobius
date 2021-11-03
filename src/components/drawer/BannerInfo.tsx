import { resources } from "../../extractor";
import { playerInfo } from "../../playerInfo";

interface Banner {
    img: string;
    title: string;
    titleColor: Array<string>;
    text: string;
    textColor: string;
}

interface Props {
    type: "shop" | "etc";
}

function BannerInfo(props: Props) {
    const { type } = props;

    const bannerInfo: Record<string, Array<Banner>> = {
        shop: [
            {
                img: "Billboard: PrincessofDawnArchfiendDawnWarrior",
                title: "Booster Greater Summon Batch 3",
                titleColor: ["#FFFFFF", "#84C492"],
                text: "Powerful EX jobs make an appearance! Snag Princess of Dusk, Archfiend, and Dawn Warrior!",
                textColor: "#FFFFFFEE",
            },
        ],
        etc: [
            {
                img: "Billboard: MobiusFFDevelopers'Room",
                title: "Mobius FF Developers' Room",
                titleColor: ["#FFFFFF", "#84C492"],
                text: `Welcome, ${playerInfo.name}, the the Mobius FF Developers' Room. Come in, and visit a different Palamecia.`,
                textColor: "#FFFFFFEE",
            },
        ],
    };

    const banner: Banner = bannerInfo[type][Math.floor(Math.random() * bannerInfo[type].length)];

    return (
        <div
            style={{
                height: "35.47rem",
                width: "41.67rem",
            }}
        >
            {/* Banner image */}
            <div
                style={{
                    height: "17.36rem",
                    width: "42.92rem",
                    border: "1px solid #FFFFFF66",
                    padding: "0.4rem 0.35rem",
                    marginTop: "2rem",
                    marginLeft: "-0.89rem",
                }}
            >
                <img
                    src={resources[banner.img]}
                    style={{
                        height: "17.1rem",
                        width: "42.77rem",
                        border: "1px solid #FFFFFFAA",
                    }}
                />
                <img
                    src={resources["Icon: DrawerBillboardCorner"]}
                    style={{
                        height: "6rem",
                        position: "absolute",
                        top: "8.6rem",
                    }}
                />
                <img
                    src={resources["Icon: DrawerBillboardCorner"]}
                    style={{
                        height: "6rem",
                        position: "absolute",
                        top: "8.6rem",
                        right: "3.6rem",
                        transform: "rotate(90deg)",
                    }}
                />
                <img
                    src={resources["Icon: DrawerBillboardCorner"]}
                    style={{
                        height: "6rem",
                        position: "absolute",
                        top: "20rem",
                        transform: "rotate(-90deg)",
                    }}
                />
                <img
                    src={resources["Icon: DrawerBillboardCorner"]}
                    style={{
                        height: "6rem",
                        position: "absolute",
                        top: "20rem",
                        right: "3.6rem",
                        transform: "rotate(180deg)",
                    }}
                />
            </div>
            {/* Banner text */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    textAlign: "center",
                    width: "36.5rem",
                }}
            >
                <p
                    style={{
                        fontSize: "1.9rem",
                        lineHeight: "2.3rem",
                        background: `-webkit-linear-gradient(${banner.titleColor[0]}, ${banner.titleColor[1]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {banner.title}
                </p>
                <p
                    style={{
                        color: banner.textColor,
                        fontSize: "1.8rem",
                        lineHeight: "2rem",
                    }}
                >
                    {banner.text}
                </p>
            </div>
        </div>
    );
}

export default BannerInfo;
