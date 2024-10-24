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
    "Icon: Drawer_BackgroundGradient",
];

// Resources needed for base menu layout
const baseResourceList: Array<string> = [
    "Icon: Drawer_ButtonInner_Top",
    "Icon: Drawer_ButtonInner_Middle",
    "Icon: Drawer_ButtonInner_Bottom",
    "Icon: Drawer_HomeButton",
    "Icon: Drawer_HomeTriangle",
    "Icon: Drawer_CardsLogo",
    "Icon: FireSkillseed_Small",
    "Icon: WaterSkillseed_Small",
    "Icon: WindSkillseed_Small",
    "Icon: EarthSkillseed_Small",
    "Icon: LightSkillseed_Small",
    "Icon: DarkSkillseed_Small",
    "Icon: PrismaticSkillseed_Small",
    "Icon: Crystal",
    "Icon: Gil",
    "Icon: Magicite",

    "Icon: Drawer_BackgroundIcon",
    "Icon: Drawer_AlertBackground",
    "Icon: Drawer_AlertBorder",
    "Icon: SkillDraw1*_Small",
    "Icon: SkillDraw2*_Small",
    "Icon: SkillDraw3*_Small",
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

    "Icon: Drawer_BillboardCorner",
    "Billboard: MobiusFFDevelopers'Room",
    "Billboard: PrincessofDawnArchfiendDawnWarrior",

    // "Regionmap: Chaos Vortex",
    "Regionmap: Tower",

    "Icon: MapNode_Red",
    "Icon: MapNode_Green",
    "Icon: MapNode_Yellow",
    "Icon: MapNode_Black",
    "Icon: MapNode_Blue",
    "Icon: MapNode_Orange",
    "Icon: Map_PlayerLocation",
    "Icon: Map_ChangePlayerLocation",
    "Icon: Map_ChangingPlayerLocation",
    "Icon: Map_CurrentLocationButton",
    "Icon: Map_Completed",
    "Icon: MapPath_Normal",

    "Icon: ModalTitleBackground",
    "Icon: ModalTitleIcon",
    "Icon: ConfirmBattle_Stamina",
    "Icon: ConfirmBattle_Battles",
    "Icon: ConfirmBattle_Monster",
    "Icon: ConfirmBattle_Warning",
    "Icon: ConfirmBattle_Difficulty",
    "Icon: Ether_Small",
    "Icon: WarpShard_Small",
    "Icon: PhoenixDown_Small",

    "Icon: DeckBackground_TopLeft",
    "Icon: DeckBackground_TopMiddle",
    "Icon: DeckBackground_TopRight",
    "Icon: DeckBackground_MiddleLeft",
    "Icon: DeckBackground_MiddleRight",
    "Icon: DeckBackground_BottomLeft",
    "Icon: DeckBackground_BottomMiddle",
    "Icon: DeckBackground_BottomRight",
    "Icon: DeckSelectionBall",

    "Icon: JobThumbnailCrown",

    "Icon: ButtonBorder_Left",
    "Icon: ButtonBorder_Middle",
    "Icon: ButtonBorder_Right",
    "Icon: CycleJob",

    "Icon: Battle_BottomBackground",
    "Icon: Battle_BottomHighlight",
    "Icon: Battle_JobChangeBackground",
    "Icon: Battle_BattleInfoBackground",
    "Icon: Battle_HelpButtonBackground",
    "Icon: Battle_AbilityNameBackground",
    "Icon: Battle_OrbBarBackgroundS1",
    // "Icon: Battle_OrbBarBackgroundS2",
    "Icon: Battle_ElementWheelInner",
    "Icon: Battle_ElementWheelCover",
    "Icon: Battle_ElementWheelSpinningCover",
    "Icon: Battle_ElementWheelElementSpike",
    "Icon: Battle_ElementWheelUltimateSpike",
    "Icon: Battle_DriveOrbSelectionBackground",
    "Icon: Battle_UltimateSelectionBackground",
    "Icon: Battle_JobChangeSelectionBackground",
    "Icon: Battle_JobChangeSelectionSpike",
    "Icon: Battle_HPBarBackground_Left",
    "Icon: Battle_HPBarBackground_Middle",
    "Icon: Battle_HPBarBackground_Right",
    "Icon: Battle_EnemyInfoBackground_Left",
    "Icon: Battle_EnemyInfoBackground_Middle",
    "Icon: Battle_EnemyInfoBackground_Right",
    "Icon: Battle_EnemyTargetHand",
    "Icon: Battle_UltimateBarIcon",
    "Icon: Battle_UltimateBar",
    "Icon: Battle_ButtonBackground_Left",
    "Icon: Battle_ButtonBackground_Middle",
    "Icon: Battle_ButtonBackground_Right",

    "Icon: Battle_TurnBackground_Left",
    "Icon: Battle_TurnBackground_Middle",
    "Icon: Battle_TurnBackground_Right",
    "Icon: Battle_CardAreaBackground",
    "Icon: Battle_CardElementCostBackground",
    "Icon: Battle_CardBackground_Top",
    "Icon: Battle_CardBackground_Bottom",
    "Icon: Battle_AreaIcon",
    "Billboard: Break",

    "Icon: Battle_Number0",
    "Icon: Battle_Number1",
    "Icon: Battle_Number2",
    "Icon: Battle_Number3",
    "Icon: Battle_Number4",
    "Icon: Battle_Number5",
    "Icon: Battle_Number6",
    "Icon: Battle_Number7",
    "Icon: Battle_Number8",
    "Icon: Battle_Number9",

    "Icon: BattleResult_Background",
    "Icon: Boomerang",
    "Icon: GradientLine",
    "Icon: GradientLine_Half",

    "Icon: CardThumbnail_Decoration5*",
    // "Icon: CardThumbnail_Decoration4*",
    "Icon: CardThumbnail_Decoration3*",
    // "Icon: CardThumbnail_Decoration2*",
    "Icon: CardThumbnail_DecorationRainbow",

    "Icon: FireOrb",
    "Icon: WaterOrb",
    "Icon: WindOrb",
    "Icon: EarthOrb",
    "Icon: LightOrb",
    "Icon: DarkOrb",
    "Icon: LifeOrb",
    "Icon: PrismaticOrb",
    "Icon: NullOrb",
    "Icon: FireOrb_Bordered",
    "Icon: WaterOrb_Bordered",
    "Icon: WindOrb_Bordered",
    "Icon: EarthOrb_Bordered",
    "Icon: LightOrb_Bordered",
    "Icon: DarkOrb_Bordered",
    "Icon: LifeOrb_Bordered",
    // "Icon: PrismaticOrb_Bordered",
    // "Icon: NullOrb_Bordered",

    "Icon: Faith_Square",
    "Icon: Faith_Hexagon",
    "Icon: FaithII_Square",
    "Icon: FaithII_Hexagon",
    "Icon: Brave_Square",
    "Icon: Brave_Hexagon",
    "Icon: BraveII_Square",
    "Icon: BraveII_Hexagon",
    "Icon: Boost_Square",
    "Icon: Boost_Hexagon",
    "Icon: BoostII_Square",
    "Icon: BoostII_Hexagon",
    "Icon: Haste_Square",
    "Icon: Haste_Hexagon",
    // "Icon: Haste_Octagon",
    "Icon: Wall_Square",
    "Icon: Wall_Hexagon",
    "Icon: WallII_Square",
    "Icon: WallII_Hexagon",
    "Icon: Barrier_Square",
    "Icon: Barrier_Hexagon",
    "Icon: BarrierII_Square",
    "Icon: BarrierII_Hexagon",
    "Icon: Snipe_Square",
    "Icon: Snipe_Hexagon",
    "Icon: SnipeII_Square",
    "Icon: SnipeII_Hexagon",
    "Icon: Berserk_Square",
    "Icon: Berserk_Hexagon",
    // "Icon: Berserk_Octagon",
    "Icon: BerserkII_Square",
    "Icon: BerserkII_Hexagon",
    "Icon: EnhanceElementalAttacks_Square",
    "Icon: EnhanceElementalAttacks_Hexagon",
    "Icon: EnhanceElementalAttacksII_Square",
    "Icon: EnhanceElementalAttacksII_Hexagon",
    "Icon: Debarrier_Square",
    "Icon: Debarrier_Hexagon",
    "Icon: DebarrierII_Square",
    "Icon: DebarrierII_Hexagon",
    "Icon: Unguard_Square",
    "Icon: Unguard_Hexagon",
    "Icon: Stun_Square",
    "Icon: Stun_Hexagon",
    "Icon: Weaken_Square",
    "Icon: Weaken_Hexagon",
    "Icon: WeakenII_Square",
    "Icon: WeakenII_Hexagon",
    "Icon: BreakDefenseDown_Square",
    "Icon: BreakDefenseDown_Hexagon",
    "Icon: BreakDefenseDownII_Square",
    "Icon: BreakDefenseDownII_Hexagon",
    "Icon: CriticalResistDown_Square",
    "Icon: CriticalResistDown_Hexagon",
    "Icon: CriticalResistDownII_Square",
    "Icon: CriticalResistDownII_Hexagon",
    "Icon: ImmuneToAilments_Square",
    "Icon: ImmuneToAilments_Hexagon",
    // "Icon: ImmuneToAilments_Octagon",
    "Icon: EnhanceFire_Square",
    "Icon: EnhanceFire_Hexagon",
    "Icon: EnhanceWater_Square",
    "Icon: EnhanceWater_Hexagon",
    "Icon: EnhanceWind_Square",
    "Icon: EnhanceWind_Hexagon",
    "Icon: EnhanceEarth_Square",
    "Icon: EnhanceEarth_Hexagon",
    "Icon: EnhanceLight_Square",
    "Icon: EnhanceLight_Hexagon",
    "Icon: EnhanceDark_Square",
    "Icon: EnhanceDark_Hexagon",
    "Icon: ResistFire_Square",
    "Icon: ResistFire_Hexagon",
    "Icon: ResistWater_Square",
    "Icon: ResistWater_Hexagon",
    "Icon: ResistWind_Square",
    "Icon: ResistWind_Hexagon",
    "Icon: ResistEarth_Square",
    "Icon: ResistEarth_Hexagon",
    "Icon: ResistLight_Square",
    "Icon: ResistLight_Hexagon",
    "Icon: ResistDark_Square",
    "Icon: ResistDark_Hexagon",
    "Icon: Flameforce_Square",
    "Icon: Flameforce_Hexagon",
    "Icon: Iceforce_Square",
    "Icon: Iceforce_Hexagon",
    "Icon: Windforce_Square",
    "Icon: Windforce_Hexagon",
    "Icon: Earthforce_Square",
    "Icon: Earthforce_Hexagon",
    "Icon: Lightforce_Square",
    "Icon: Lightforce_Hexagon",
    "Icon: Darkforce_Square",
    "Icon: Darkforce_Hexagon",
    "Icon: LucidWar_Square",
    "Icon: LucidWar_Hexagon",
    // "Icon: LucidWar_Octagon",
    "Icon: LucidCast_Square",
    "Icon: LucidCast_Hexagon",
    // "Icon: LucidCast_Octagon",
    "Icon: LucidHunt_Square",
    "Icon: LucidHunt_Hexagon",
    // "Icon: LucidHunt_Octagon",
    "Icon: LucidFist_Square",
    "Icon: LucidFist_Hexagon",
    // "Icon: LucidFist_Octagon",
    "Icon: LucidWarII_Square",
    "Icon: LucidWarII_Hexagon",
    // "Icon: LucidWarII_Octagon",
    "Icon: LucidCastII_Square",
    "Icon: LucidCastII_Hexagon",
    // "Icon: LucidCastII_Octagon",
    "Icon: LucidHuntII_Square",
    "Icon: LucidHuntII_Hexagon",
    // "Icon: LucidHuntII_Octagon",
    "Icon: LucidFistII_Square",
    "Icon: LucidFistII_Hexagon",
    // "Icon: LucidFistII_Octagon",
    "Icon: Curse_Square",
    "Icon: Curse_Hexagon",
    "Icon: CurseII_Square",
    "Icon: CurseII_Hexagon",
    "Icon: Debrave_Square",
    "Icon: Debrave_Hexagon",
    "Icon: DebraveII_Square",
    "Icon: DebraveII_Hexagon",
    "Icon: Slump_Square",
    "Icon: Slump_Hexagon",
    "Icon: Slow_Square",
    "Icon: Slow_Hexagon",
    "Icon: Slow_Octagon",
    "Icon: ImbueFire_Square",
    "Icon: ImbueFire_Hexagon",
    "Icon: ImbueWater_Square",
    "Icon: ImbueWater_Hexagon",
    "Icon: ImbueWind_Square",
    "Icon: ImbueWind_Hexagon",
    "Icon: ImbueEarth_Square",
    "Icon: ImbueEarth_Hexagon",
    "Icon: ImbueLight_Square",
    "Icon: ImbueLight_Hexagon",
    "Icon: ImbueDark_Square",
    "Icon: ImbueDark_Hexagon",
    "Icon: DivineShield_Square",
    "Icon: DivineShield_Hexagon",
    "Icon: Veil_Square",
    "Icon: Veil_Hexagon",
    "Icon: Regen_Square",
    "Icon: Regen_Hexagon",
    "Icon: Drain_Square",
    "Icon: Drain_Hexagon",
    "Icon: KnightsOfTheRound_Square",
    "Icon: KnightsOfTheRound_Hexagon",
    "Icon: Genesis_Square",
    "Icon: Genesis_Hexagon",
    "Icon: Hex_Square",
    "Icon: Hex_Hexagon",
    "Icon: EternalLight_Square",
    "Icon: CallOfTheVoid_Square",
    "Icon: Taunt_Square",
    "Icon: Taunt_Hexagon",
    "Icon: Bio_Square",
    "Icon: Bio_Hexagon",
    "Icon: Bio_Octagon",
    "Icon: BioII_Square",
    "Icon: BioII_Hexagon",

    "Icon: Warrior",
    "Icon: Warrior_Bordered",
    "Icon: Ranger",
    "Icon: Ranger_Bordered",
    "Icon: Mage",
    "Icon: Mage_Bordered",
    "Icon: Monk",
    "Icon: Monk_Bordered",
    "Icon: Support",
    "Icon: Support_Bordered",

    "Thumbnail: Warrior",
    "Thumbnail: Ares",
    "Thumbnail: Knights of the Round: FFVII",
    "Thumbnail: Xezat: FFV",
    "Thumbnail: Jormungand",
    "Thumbnail: Brynhildr",
    "Card: 5-8* Frame",
];

export { tilesetList, loadingResourceList, baseResourceList };
