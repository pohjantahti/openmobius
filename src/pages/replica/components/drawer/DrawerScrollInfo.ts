interface ScrollInfo {
    name: string;
    nameSize?: string;
    img: string;
    link: string;
    text?: string;
    textSize?: string;
    alert?: number;
}

interface DrawerScrollInfoType {
    cards: Array<ScrollInfo>;
    social: Array<ScrollInfo>;
    shop: Array<ScrollInfo>;
    etc: Array<ScrollInfo>;
}

const drawerScrollInfo: DrawerScrollInfoType = {
    cards: [
        {
            name: "Decks",
            img: "Icon: Cards_Decks",
            link: "",
        },
        {
            name: "Multiplayer Decks",
            img: "Icon: Cards_MultiplayerDecks",
            link: "",
        },
        {
            name: "Ability Cards",
            img: "Icon: Cards_AbilityCards",
            link: "",
            text: "Owned: 312/350",
            alert: 8,
        },
        {
            name: "Card Bank",
            img: "Icon: Cards_CardBank",
            link: "",
            text: "Storage: 334/350",
            alert: 30,
        },
        {
            name: "Fusion",
            img: "Icon: Cards_Fusion",
            link: "",
        },
        {
            name: "Auto-Enhance",
            img: "Icon: Cards_Auto-Enhance",
            link: "",
            text: "Slots used: 2/8",
        },
        {
            name: "Sell Cards",
            img: "Icon: Cards_SellCards",
            link: "",
        },
        {
            name: "Card Augment",
            img: "Icon: Cards_CardAugment",
            link: "",
        },
        {
            name: "Job Cards",
            img: "Icon: Cards_JobCards",
            link: "",
            text: "Owned: 143",
            alert: 2,
        },
        {
            name: "Skill Cards",
            img: "Icon: Cards_SkillCards",
            link: "",
            text: "Owned: 524",
        },
        {
            name: "Card Catalog",
            img: "Icon: Cards_CardCatalog",
            link: "",
            text: "Opened: 2336/3373",
        },
    ],
    social: [
        {
            name: "Profile",
            img: "Icon: Social_Profile",
            link: "",
            text: "Friend Tickets: 3928",
        },
        {
            name: "Edit Stamps",
            img: "Icon: Social_EditStamps",
            link: "",
        },
        {
            name: "Item List",
            img: "Icon: Social_ItemList",
            link: "",
        },
        {
            name: "Weekly Ranking",
            img: "Icon: Social_WeeklyRanking",
            link: "",
            text: "Current Rank: 1",
        },
        {
            name: "Event Rankings",
            img: "Icon: Social_EventRankings",
            link: "",
            text: "Closed",
        },
        {
            name: "Titles",
            img: "Icon: Social_Titles",
            link: "",
        },
        {
            name: "Login Bonus",
            img: "Icon: Social_LoginBonus",
            link: "",
        },
        {
            name: "Following",
            img: "Icon: Social_Following",
            link: "",
            text: "People Followed: 30/30",
        },
        {
            name: "Followers",
            img: "Icon: Social_Followers",
            link: "",
        },
        {
            name: "Friend ID Search",
            img: "Icon: Social_FriendIDSearch",
            link: "",
        },
    ],
    shop: [
        {
            name: "Purchase Magicite",
            img: "Icon: Shop_PurchaseMagicite",
            link: "",
        },
        {
            name: "Purchase Mobius Gift Box",
            nameSize: "2.2rem",
            img: "Icon: Shop_PurchaseMobiusGiftBox",
            link: "",
            text: "Valid for 7 more days. / Purchased: 41",
            textSize: "1.4rem",
        },
        {
            name: "Mobius VIP Mode",
            img: "Icon: Shop_MobiusVIPMode",
            link: "",
            text: "Currently inactive. Purchase magicite to activate.",
            textSize: "1.2rem",
        },
        {
            name: "Item Shop",
            img: "Icon: Shop_ItemShop",
            link: "",
            text: "Check here for daily deals!",
        },
        {
            name: "Ability Shop",
            img: "Icon: Shop_AbilityShop",
            link: "",
            text: "Ability Tickets: 3561",
        },
        {
            name: "Summon Cards",
            img: "Icon: Shop_SummonCards",
            link: "",
            text: "Summon Tickets: 3",
        },
        {
            name: "Skill Draw",
            img: "Icon: Shop_SkillDraw",
            link: "",
            text: "x5,x237,x672",
        },
        {
            name: "Boost Weapon",
            img: "Icon: Shop_BoostWeapon",
            link: "",
            text: "Slots used 0/6",
        },
        {
            name: "Spirit Grove",
            img: "Icon: Shop_SpiritGrove",
            link: "",
            text: "Spirit Tickets: 5",
        },
        {
            name: "Expand Card Slots",
            img: "Icon: Shop_ExpandCardSlots",
            link: "",
            text: "Owned: 312/350",
        },
        {
            name: "Expand Card Bank",
            img: "Icon: Shop_ExpandCardBank",
            link: "",
            text: "Storage: 334/350",
        },
        {
            name: "Restore Stamina",
            img: "Icon: Shop_RestoreStamina",
            link: "",
            text: "Elixirs: 91",
        },
    ],
    etc: [
        {
            name: "Config",
            img: "Icon: ETC_Config",
            link: "",
        },
        {
            name: "Windows Config",
            img: "Icon: ETC_WindowsConfig",
            link: "",
        },
        {
            name: "Story & Theater",
            img: "Icon: ETC_Story&Theater",
            link: "",
        },
        {
            name: "Help",
            img: "Icon: ETC_Help",
            link: "",
        },
        {
            name: "Related Info",
            img: "Icon: ETC_RelatedInfo",
            link: "",
        },
        {
            name: "Achievements",
            img: "Icon: ETC_Achievements",
            link: "",
        },
        {
            name: "Save File Sharing",
            img: "Icon: ETC_SaveFileSharing",
            link: "",
        },
        {
            name: "Keybinds",
            img: "Icon: ETC_Keybinds",
            link: "",
        },
        {
            name: "Controller Config",
            img: "Icon: ETC_ControllerConfig",
            link: "",
        },
        {
            name: "Customer ID",
            img: "Icon: ETC_CustomerID",
            link: "",
        },
        {
            name: "Support",
            img: "Icon: ETC_Support",
            link: "",
        },
        {
            name: "Magicite Purchase Info",
            img: "Icon: ETC_MagicitePurchaseInfo",
            link: "",
        },
        {
            name: "Reset Save Data",
            img: "Icon: ETC_ResetSaveData",
            link: "",
        },
        {
            name: "Terms of Service",
            img: "Icon: ETC_TermsofService",
            link: "",
        },
        {
            name: "Copyright Info",
            img: "Icon: ETC_CopyrightInfo",
            link: "",
        },
    ],
};

export default drawerScrollInfo;
