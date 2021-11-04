// Tilesets to be saved
const tilesetList: Array<string> = [
    "Icon: ResidentAtlas",
    "Icon: ResidentAtlas2",
    "Icon: ResidentIcon",
];

// Resources needed for the initial loading screen
const loadingResourceList: Array<string> = [
    "Font: Main",
    "Font: MainBold",
    "Font: Cinema",
    "Icon: Loading_Background",
    "Icon: Loading_Decoration",
    "Icon: Loading_Wheel",
    "Icon: Loading_SELogo",
    "Icon: ETC_Support",
    "Icon: DrawerBackgroundGradient",
];

// Resources needed for base menu layout
const baseResourceList: Array<string> = [
    "Icon: DrawerButtonInnerTop",
    "Icon: DrawerButtonInnerMiddle",
    "Icon: DrawerButtonInnerBottom",
    "Icon: DrawerHomeButton",
    "Icon: DrawerHomeTriangle",
    "Icon: DrawerCardsLogo",
    "Icon: Fire Skillseed Small",
    "Icon: Water Skillseed Small",
    "Icon: Wind Skillseed Small",
    "Icon: Earth Skillseed Small",
    "Icon: Light Skillseed Small",
    "Icon: Dark Skillseed Small",
    "Icon: Crystal",
    "Icon: Gil",
    "Icon: Magicite",

    "Icon: DrawerBackgroundIcon",
    "Icon: DrawerAlertBackground",
    "Icon: DrawerAlertBorder",
    "Icon: SkillDrawSmall1*",
    "Icon: SkillDrawSmall2*",
    "Icon: SkillDrawSmall3*",
    "Icon: Cards_Decks",
    "Icon: Cards_MultiplayerDecks",
    "Icon: Cards_AbilityCards",
    "Icon: Cards_CardBank",
    "Icon: Cards_Fusion",
    "Icon: Cards_Auto-Enhance",
    "Icon: Cards_SellCards",
    "Icon: Cards_CardAugment",
    "Icon: Cards_JobCards",
    "Icon: Cards_SkillCards",
    "Icon: Cards_CardCatalog",
    "Icon: Social_Profile",
    "Icon: Social_EditStamps",
    "Icon: Social_ItemList",
    "Icon: Social_WeeklyRanking",
    "Icon: Social_EventRankings",
    "Icon: Social_Titles",
    "Icon: Social_LoginBonus",
    "Icon: Social_Following",
    "Icon: Social_Followers",
    "Icon: Social_FriendIDSearch",
    "Icon: Shop_PurchaseMagicite",
    "Icon: Shop_PurchaseMobiusGiftBox",
    "Icon: Shop_MobiusVIPMode",
    "Icon: Shop_ItemShop",
    "Icon: Shop_AbilityShop",
    "Icon: Shop_SummonCards",
    "Icon: Shop_SkillDraw",
    "Icon: Shop_BoostWeapon",
    "Icon: Shop_SpiritGrove",
    "Icon: Shop_ExpandCardSlots",
    "Icon: Shop_ExpandCardBank",
    "Icon: Shop_RestoreStamina",
    "Icon: ETC_Config",
    "Icon: ETC_WindowsConfig",
    "Icon: ETC_Story&Theater",
    "Icon: ETC_Help",
    "Icon: ETC_RelatedInfo",
    "Icon: ETC_Achievements",
    "Icon: ETC_SaveFileSharing",
    "Icon: ETC_Keybinds",
    "Icon: ETC_ControllerConfig",
    "Icon: ETC_CustomerID",
    "Icon: ETC_MagicitePurchaseInfo",
    "Icon: ETC_ResetSaveData",
    "Icon: ETC_TermsofService",
    "Icon: ETC_CopyrightInfo",
    "Icon: Home_Info",
    "Icon: Home_Gifts",
    "Icon: Home_MapInfo",
    "Icon: Home_WorldMap",

    "Icon: MagiciteDistiller",
    "Icon: MagiciteDistillerArrow",
    "Icon: Singleplayer",
    "Icon: Multiplayer",

    "Icon: DrawerBillboardCorner",
    "Billboard: MobiusFFDevelopers'Room",
    "Billboard: PrincessofDawnArchfiendDawnWarrior",

    "Regionmap: Chaos Vortex",
    "Regionmap: Tower",

    "Icon: Map_NodeRed",
    "Icon: Map_NodeGreen",
    "Icon: Map_NodeYellow",
    "Icon: Map_NodeBlack",
    "Icon: Map_NodeBlue",
    "Icon: Map_NodeOrange",
    "Icon: Map_PlayerLocation",
    "Icon: Map_ChangePlayerLocation",
    "Icon: Map_ChangingPlayerLocation",
    "Icon: Map_CurrentLocationButton",
    "Icon: Map_Completed",
    "Icon: Map_PathNormal",

    "Icon: ModalTitleBackground",
    "Icon: ModalTitleIcon",
    "Icon: ConfirmBattleStamina",
    "Icon: ConfirmBattleBattles",
    "Icon: ConfirmBattleMonster",
    "Icon: ConfirmBattleWarning",

    // "Icon: Battle_BottomBackground",
    // "Icon: Battle_BottomHighlight",
    // "Icon: Battle_JobChangeBackground",
    // "Icon: Battle_BattleInfoBackground",
    // "Icon: Battle_HelpButtonBackground",
    // "Icon: Battle_AbilityNameBackground",
    // "Icon: Battle_OrbBarBackgroundS1",
    // "Icon: Battle_OrbBarBackgroundS2",
    // "Icon: Battle_ElementWheelInner",
    // "Icon: Battle_ElementWheelCover",
    // "Icon: Battle_ElementWheelSpinningCover",
    // "Icon: Battle_ElementWheelElementSpike",
    // "Icon: Battle_ElementWheelUltimateSpike",
    // "Icon: Battle_DriveOrbSelectionBackground",
    // "Icon: Battle_UltimateSelectionBackground",
    // "Icon: Battle_JobChangeSelectionBackground",
    // "Icon: Battle_JobChangeSelectionSpike",
    // "Icon: Battle_HPBarBackgroundLeft",
    // "Icon: Battle_HPBarBackgroundMiddle",
    // "Icon: Battle_HPBarBackgroundRight",
    // "Icon: Battle_EnemyInfoBackgroundLeft",
    // "Icon: Battle_EnemyInfoBackgroundMiddle",
    // "Icon: Battle_EnemyInfoBackgroundRight",
    // "Icon: Battle_EnemyTargetHand",
    // "Icon: Battle_UltimateBarIcon",
    // "Icon: Battle_UltimateBar",
    // "Icon: Battle_ButtonBackgroundLeft",
    // "Icon: Battle_ButtonBackgroundMiddle",
    // "Icon: Battle_ButtonBackgroundRight",

    // "Icon: Battle_TurnBackgroundLeft",
    // "Icon: Battle_TurnBackgroundMiddle",
    // "Icon: Battle_TurnBackgroundRight",
    // "Icon: Battle_CardAreaBackground",
    // "Icon: Battle_CardElementCostBackground",
    // "Icon: Battle_CardBackgroundTop",
    // "Icon: Battle_CardBackgroundBottom",

    // "Icon: Battle_Number0",
    // "Icon: Battle_Number1",
    // "Icon: Battle_Number2",
    // "Icon: Battle_Number3",
    // "Icon: Battle_Number4",
    // "Icon: Battle_Number5",
    // "Icon: Battle_Number6",
    // "Icon: Battle_Number7",
    // "Icon: Battle_Number8",
    // "Icon: Battle_Number9",

    // "Icon: CardThumbnailDecoration5*",
    // "Icon: CardThumbnailDecoration4*",
    // "Icon: CardThumbnailDecoration3*",
    // "Icon: CardThumbnailDecoration2*",
    // "Icon: CardThumbnailDecorationRainbow",

    // "Icon: FireOrb",
    // "Icon: WaterOrb",
    // "Icon: WindOrb",
    // "Icon: EarthOrb",
    // "Icon: LightOrb",
    // "Icon: DarkOrb",
    // "Icon: LifeOrb",
    // "Icon: PrismaticOrb",
    // "Icon: NullOrb",
    // "Icon: FireOrbBordered",
    // "Icon: WaterOrbBordered",
    // "Icon: WindOrbBordered",
    // "Icon: EarthOrbBordered",
    // "Icon: LightOrbBordered",
    // "Icon: DarkOrbBordered",
    // "Icon: LifeOrbBordered",
    // "Icon: PrismaticOrbBordered",
    // "Icon: NullOrbBordered",

    // "Icon: Faith_Square",
    // "Icon: Faith_Hexagon",
    // "Icon: Brave_Square",
    // "Icon: Brave_Hexagon",
    // "Icon: Boost_Square",
    // "Icon: Boost_Hexagon",

    // "Icon: Warrior",
    // "Icon: Warrior_Bordered",
    // "Icon: Ranger",
    // "Icon: Ranger_Bordered",
    // "Icon: Mage",
    // "Icon: Mage_Bordered",
    // "Icon: Monk",
    // "Icon: Monk_Bordered",
];

export { tilesetList, loadingResourceList, baseResourceList };
