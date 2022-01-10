import { Card } from "../data/game/cards";
import { Enemy } from "../data/game/enemies";
import { JobClass, Element, FullElement, Target } from "../info/types";
import EnemyActor from "./EnemyActor";

type BattleFullDeck = [BattleDeck, BattleDeck];

interface BattleDeck {
    job: BattleJob;
    cards: Array<Card | undefined>;
}

interface BattleJob {
    id: number;
    name: string;
    resources: {
        card: string;
        thumbnail: string;
    };
    class: JobClass;
    level: number;
    overboost: number;
    elements: [Element, Element, Element];
    stats: {
        hp: {
            current: number;
            max: number;
        };
        attack: number;
        breakPower: number;
        magic: number;
        critical: number;
        speed: number;
        defense: number;
    };
    elementEnhance: Record<Element, number>;
    elementResistance: Record<Element, number>;
    autoAbilities: Partial<Record<AutoAbility, number>>;
    ultimate: {
        name: string;
        attack: number;
        breakPower: number;
        critical: number;
        target: Target;
        hits: number;
        level: number;
        lastHitAttack?: number;
        lastHitBreakPower?: number;
        lastHitTarget?: Target;
        effect?: Array<{
            name: Boon | Ailment;
            duration: number;
            target: Target;
            timing: "before" | "after";
            type?: "square" | "hexagon";
        }>;
    };
}

interface BattleInfo {
    battleResources: Record<string, string>;
    score: number;
    wave: {
        current: number;
        max: number;
    };
    elements: {
        main: [Element, Element, Element];
        sub: [Element, Element, Element];
    };
    elementWheel: [number, number, number];

    cards: Array<Card | undefined>;
    ultimate: {
        gauge: {
            current: number;
            max: number;
        };
        name: string;
    };
    jobClass: JobClass;

    enemies: Array<EnemyActor>;
    targetIndex: number;

    hp: {
        main: {
            current: number;
            max: number;
        };
        sub?: {
            current: number;
            max: number;
        };
    };
    countdownToJobChange: number;
    orbs: Record<FullElement, number>;
    actions: number;
    damageToEnemies: Array<DamageToEnemies>;
    isBattleCompleted: boolean;
    playerCard: string;
    damageToPlayer: Array<{
        damage: number;
    }>;
    playerEffects: Array<BattleEffect>;
    healToPlayer: Array<number>;
    poisonToPlayer: Array<number>;
}

enum BattleAction {
    Help = "help",
    TargetView = "targetView",
    ChangeTarget = "changeTarget",
    Auto = "auto",
    Tap = "tap",
    Drive = "drive",
    Ultimate = "ultimate",
    JobChange = "jobChange",
    Card = "card",
}

enum Boon {
    AbilityIgnition = "abilityIgnition",
    AbsoluteDefense = "absoluteDefense",
    AttackIgnition = "attackIgnition",
    Barrier = "barrier",
    BarrierII = "barrierII",
    Berserk = "berserk",
    BerserkII = "berserkII",
    Blitzball = "blitzball",
    BloodlustX = "bloodlustX",
    Boost = "boost",
    BoostII = "boostII",
    Brave = "brave",
    BraveII = "braveII",
    BreakDefenseUp = "breakDefenseUp",
    BreakImmunity = "breakImmunity",
    BurstMode = "burstMode",
    ChargingAttack = "chargingAttack",
    CleavingAttack = "cleavingAttack",
    CriticalResistUp = "criticalResistUp",
    DamageAbsorption = "damageAbsorption",
    DamageReduction = "damageReduction",
    DarkBoost = "darkBoost",
    DarkWeapon = "darkWeapon",
    Darkforce = "darkforce",
    DivineShield = "divineShield",
    Drain = "drain",
    DriveIgnition = "driveIgnition",
    EarthBoost = "earthBoost",
    EarthOfChaos = "earthOfChaos",
    EarthPact = "earthPact",
    EarthWeapon = "earthWeapon",
    EarthForce = "earthForce",
    EnhanceElementalAttacks = "enhanceElementalAttacks",
    EnhanceElementalAttacksII = "enhanceElementalAttacksII",
    EternalLight = "eternalLight",
    Faith = "faith",
    FaithII = "faithII",
    FeatherCharge = "featherCharge",
    FireBoost = "fireBoost",
    FirePact = "firePact",
    FireWeapon = "fireWeapon",
    Flameforce = "flameforce",
    FlamesOfChaos = "flamesOfChaos",
    FullRemission = "fullRemission",
    GiantsDrink = "giantsDrink",
    Haste = "haste",
    Iceforce = "iceforce",
    ImmuneToAilments = "immuneToAilments",
    ImmuneToBio = "immuneToBio",
    ImmuneToBreakDefenseDown = "immuneToBreakDefenseDown",
    ImmuneToCriticalResistDown = "immuneToCriticalResistDown",
    ImmuneToCurse = "immuneToCurse",
    ImmuneToDebarrier = "immuneToDebarrier",
    ImmuneToDebilitate = "immuneToDebilitate",
    ImmuneToDebrave = "immuneToDebrave",
    ImmuneToSleep = "immuneToSleep",
    ImmuneToSlow = "immuneToSlow",
    ImmuneToStun = "immuneToStun",
    ImmuneToTaunt = "immuneToTaunt",
    ImmuneToUnguard = "immuneToUnguard",
    ImmuneToWeaknessDown = "immuneToWeaknessDown",
    ImmuneToFatigue = "immuneToFatigue",
    ImmuneToHex = "immuneToHex",
    KnightsOfTheRound = "knightsOfTheRound",
    LightBoost = "lightBoost",
    LightPact = "lightPact",
    LightWeapon = "lightWeapon",
    Lightforce = "lightforce",
    LucidCast = "lucidCast",
    LucidCastII = "lucidCastII",
    LucidFist = "lucidFist",
    LucidFistII = "lucidFistII",
    LucidHunt = "lucidHunt",
    LucidHuntII = "lucidHuntII",
    LucidWar = "lucidWar",
    LucidWarII = "lucidWarII",
    MartialArts = "martialArts",
    MartialFlow = "martialFlow",
    Melee = "melee",
    Omnidrive = "omnidrive",
    PearlOfDestruction = "pearlOfDestruction",
    PerfectDefense = "perfectDefense",
    Quicken = "quicken",
    Ranged = "ranged",
    Regen = "regen",
    ResistDark = "resistDark",
    ResistEarth = "resistEarth",
    ResistFire = "resistFire",
    ResistLight = "resistLight",
    ResistWater = "resistWater",
    ResistWind = "resistWind",
    RindBarrier = "rindBarrier",
    SeedCounter = "seedCounter",
    Snipe = "snipe",
    SnipeII = "snipeII",
    TheUltimaWeaponGuardianBuff = "theUltimaWeaponGuardianBuff",
    TranceAll = "tranceAll",
    TranceAllII = "tranceAllII",
    TriBarrierFire = "triBarrierFire",
    TriBarrierWater = "triBarrierWater",
    TriBarrierWind = "triBarrierWind",
    UltimateBooster = "ultimateBooster",
    UltimateCharge = "ultimateCharge",
    UltimateGauge = "ultimateGauge",
    UmbralVeil = "umbralVeil",
    Veil = "veil",
    Wall = "wall",
    WallII = "wallII",
    WardOfChaos = "wardOfChaos",
    WaterBoost = "waterBoost",
    WaterPact = "waterPact",
    WaterWeapon = "waterWeapon",
    WavesOfChaos = "wavesOfChaos",
    WeaknessWeapon = "weaknessWeapon",
    WindBoost = "windBoost",
    WindPact = "windPact",
    WindWeapon = "windWeapon",
    Windforce = "windForce",
    WindsOfChaos = "windOfChaos",
}

enum Ailment {
    AbilityBlock = "abilityBlock",
    Bio = "bio",
    BioII = "bioII",
    BleedingOut = "bleedingOut",
    BreakDefenseDown = "breakDefenseDown",
    BreakDefenseDownII = "breakDefenseDownII",
    CallOfTheVoid = "callOfTheVoid",
    CloudedCast = "cloudedCast",
    CloudedFist = "cloudedFist",
    CloudedHunt = "cloudedHunt",
    CloudedWar = "cloudedWar",
    CriticalResistDown = "criticalResistDown",
    CriticalResistDownII = "criticalResistDownII",
    Curse = "curse",
    CurseII = "curseII",
    DarkLockout = "darkLockout",
    DeathsCurse = "deathsCurse",
    Debarrier = "debarrier",
    DebarrierII = "debarrierII",
    Debilitate = "debilitate",
    Debrave = "debrave",
    DebraveII = "debraveII",
    EarthLockout = "earthLockout",
    EdictOfEarth = "edictOfEarth",
    EdictOfFire = "edictOfFire",
    EdictOfLight = "edictOfLight",
    Fatigue = "fatigue",
    FireLockout = "fireLockout",
    Foam = "foam",
    Genesis = "genesis",
    Hex = "hex",
    HPSap = "hpSap",
    LaserDamage = "laserDamage",
    LightLockout = "lightLockout",
    MelonSeed = "melonSeed",
    Nightmare = "nightmare",
    NullWall = "nullWall",
    NullifyRecovery = "nullifyRecovery",
    Oil = "oil",
    Rampage = "rampage",
    SelfDisintegration = "selfDisintegration",
    Sleep = "sleep",
    Slow = "slow",
    Slump = "slump",
    Stun = "stun",
    Taunt = "stun",
    UltimateDrain = "ultimateDrain",
    UltimateGaugeLocked = "ultimateGaugeLocked",
    Unguard = "unguard",
    Vulnerability = "vulnerability",
    WaterLockout = "waterLockout",
    Weaken = "weaken",
    WeakenII = "weakenII",
    WindLockout = "windLockout",
}

enum AutoAbility {
    AbilityChain = "abilityChain",
    AreaElementDrives = "areaElementDrives",
    AreaHealsandBoons = "areaHealsandBoons",
    AreaUltimateChargeAbilities = "areaUltimateChargeAbilities",
    AreaUltimateChargeNormalAttacks = "areaUltimateChargeNormalAttacks",
    AttackLimitBreak = "attackLimitBreak",
    AttackUp = "attackUp",
    AttunedChain = "attunedChain",
    AutoChargeUltimate = "autoChargeUltimate",
    AvertActionLoss = "avertActionLoss",
    AvertAttackDown = "avertAttackDown",
    AvertBio = "avertBio",
    AvertBreakPowerDown = "avertBreakPowerDown",
    AvertCritDown = "avertCritDown",
    AvertDefenseDown = "avertDefenseDown",
    AvertMagicDown = "avertMagicDown",
    AvertStun = "avertStun",
    AvertUnguard = "avertUnguard",
    BarrierStarter = "barrierStarter",
    BaseAttributes = "baseAttributes",
    BoostStarter = "boostStarter",
    BoostUltimate = "boostUltimate",
    BraveStarter = "braveStarter",
    BreakPowerUp = "breakPowerUp",
    ClutchBarrier = "clutchBarrier",
    ClutchBerserk = "clutchBerserk",
    ClutchBoost = "clutchBoost",
    ClutchBrave = "clutchBrave",
    ClutchDrain = "clutchDrain",
    ClutchFaith = "clutchFaith",
    ClutchHaste = "clutchHaste",
    ClutchRegen = "clutchRegen",
    ClutchSnipe = "clutchSnipe",
    ClutchVeil = "clutchVeil",
    ClutchWall = "clutchWall",
    Counterattack = "counterattack",
    CrystalSeeker = "crystalSeeker",
    CurseStarter = "curseStarter",
    DarkDraw = "darkDraw",
    DebarrierStarter = "debarrierStarter",
    DebraveStarter = "debraveStarter",
    DiscordantChain = "discordantChain",
    DrainStarter = "drainStarter",
    EXPUp = "expUp",
    EarthDraw = "earthDraw",
    ElementStarter = "elementStarter",
    ElementalThirdStrike = "elementalThirdStrike",
    EnhanceDark = "enhanceDark",
    EnhanceEarth = "enhanceEarth",
    EnhanceFire = "enhanceFire",
    EnhanceLight = "enhanceLight",
    EnhanceWater = "enhanceWater",
    EnhanceWind = "enhanceWind",
    ExploitWeakness = "exploitWeakness",
    ExtendedBreak = "extendedBreak",
    FaithStarter = "faithStarter",
    FireDraw = "fireDraw",
    GilUp = "gilUp",
    GuardScorpionManual = "guardScorpionManual",
    HPUp = "hpUp",
    HasteStarter = "hasteStarter",
    HealingVictory = "healingVictory",
    ImprovedCriticals = "improvedCriticals",
    ImprovedExtraSkillUnlock = "improvedExtraSkillUnlock",
    JobChangeRecast = "jobChangeRecast",
    JobChangeShiftDark = "jobChangeShiftDark",
    JobChangeShiftEarth = "jobChangeShiftEarth",
    JobChangeShiftFire = "jobChangeShiftFire",
    JobChangeShiftLight = "jobChangeShiftLight",
    JobChangeShiftWater = "jobChangeShiftWater",
    JobChangeShiftWind = "jobChangeShiftWind",
    KillAndDraw = "killAndDraw",
    LifeDraw = "lifeDraw",
    LifeElementStarter = "lifeElementStarter",
    LifeOrbDrawUp = "lifeOrbDrawUp",
    LightDraw = "lightDraw",
    MPBreakPowerUp = "mpBreakPowerUp",
    MPDamageUp = "mpDamageUp",
    MPHPUp = "mpHPUp",
    MagicUp = "magicUp",
    PainfulBreak = "painfulBreak",
    PiercingBreak = "piercingBreak",
    PrismaticDraw = "prismaticDraw",
    PrismaticElementStarter = "prismaticElementStarter",
    PrismaticReturn = "prismaticReturn",
    Ravage = "ravage",
    RegenStarter = "regenStarter",
    ResistDark = "resistDark",
    ResistEarth = "resistEarth",
    ResistFire = "resistFire",
    ResistLight = "resistLight",
    ResistWater = "resistWater",
    ResistWind = "resistWind",
    Reunion = "reunion",
    ShieldSicariusBestia = "shieldSicariusBestia",
    ShieldSicariusExternus = "shieldSicariusExternus",
    ShieldSicariusImperator = "shieldSicariusImperator",
    SkillseedUp = "skillseedUp",
    SleepResistance = "sleepResistance",
    SnipeStarter = "snipeStarter",
    Spellsword = "spellsword",
    StartingActionsUp = "startingActionsUp",
    StunStarter = "stunStarter",
    TerraBattleArcher2 = "terraBattleArcher2",
    TerraBattleArcher3 = "terraBattleArcher3",
    TerraBattleArcher4 = "terraBattleArcher4",
    TerraBattleArcher5 = "terraBattleArcher5",
    TerraBattleSpearWielder2 = "terraBattleSpearWielder2",
    TerraBattleSpearWielder3 = "terraBattleSpearWielder3",
    TerraBattleSpearWielder4 = "terraBattleSpearWielder4",
    TerraBattleSpearWielder5 = "terraBattleSpearWielder5",
    TerraBattleStaffWielder2 = "terraBattleStaffWielder2",
    TerraBattleStaffWielder3 = "terraBattleStaffWielder3",
    TerraBattleStaffWielder4 = "terraBattleStaffWielder4",
    TerraBattleStaffWielder5 = "terraBattleStaffWielder5",
    TerraBattleSwordWielder2 = "terraBattleSwordWielder2",
    TerraBattleSwordWielder3 = "terraBattleSwordWielder3",
    TerraBattleSwordWielder4 = "terraBattleSwordWielder4",
    TerraBattleSwordWielder5 = "terraBattleSwordWielder5",
    UltimateCharger = "ultimateCharger",
    WallStarter = "wallStarter",
    WaterDraw = "waterDraw",
    WindDraw = "windDraw",
}

enum ExtraSkill {
    AbilityIgniton = "abilityIgnition",
    Armiger = "armiger",
    AttackIgnition = "attackIgnition",
    AttackerGuardBuster = "attackerGuardBuster",
    AttackerGuardKiller = "attackerGuardKiller",
    Augment4LimitBreak = "augment4LimitBreak",
    Augment5LimitBreak = "augment5LimitBreak",
    BadDream = "badDream",
    BloodTap = "bloodTap",
    Bloodthirst = "bloodthirst",
    BreakBalancer = "breakBalancer",
    BreakExploiter = "breakExploiter",
    BreakerKiller = "breakerKiller",
    BreathOfTheTriad = "breathOfTheTriad",
    ChargingAttack = "chargingAttack",
    CleanseEarth = "cleanseEarth",
    CleanseFlames = "cleanseFlames",
    CleanseWaters = "cleanseWaters",
    CleanseWinds = "cleanseWinds",
    CleavingAttack = "cleavingAttack",
    Convergence = "convergence",
    CriticalRetrieval = "criticalRetrieval",
    CriticalRupture = "criticalRupture",
    CriticalWeakness = "criticalWeakness",
    DamageLimitBreak = "damageLimitBreak",
    DamageLimitBreakII = "damageLimitBreakII",
    DarkPact = "darkPact",
    Dispel = "dispel",
    DriveIgnition = "driveIgnition",
    DriveTap = "driveTap",
    DurationBoost = "durationBoost",
    EarthPact = "earthPact",
    ElementEveryBuddy = "elementEveryBuddy",
    ElementTap = "elementTap",
    ElementalBounty = "elementalBounty",
    ElementalMirror = "elementalMirror",
    ElementalRetrieval = "elementalRetrieval",
    ElementalReturn = "elementalReturn",
    EnhancedAilments = "enhancedAilments",
    EnhancedBoons = "enhancedBoons",
    EnhancedDark = "enhancedDark",
    EnhancedEarth = "enhancedEarth",
    EnhancedFire = "enhancedFire",
    EnhancedLife = "enhancedLife",
    EnhancedLight = "enhancedLight",
    EnhancedWater = "enhancedWater",
    EnhancedWind = "enhancedWind",
    Esuna = "Esuna",
    ExtraLife = "extraLife",
    ExtremeBloodthirst = "extremeBloodthirst",
    FirePact = "firePact",
    Fortune = "fortune",
    GuardBreaker = "guardBreaker",
    HighVoltage = "highVoltage",
    HolyCleansing = "holyCleansing",
    ImbueDark = "imbueDark",
    ImbueEarth = "imbueEarth",
    ImbueFire = "imbueFire",
    ImbueLight = "imbueLight",
    ImbueWater = "imbueWater",
    ImbueWind = "imbueWind",
    LastingAilments = "lastingAilments",
    LastingBoons = "lastingBoons",
    LegendaryBlademaster = "legendaryBlademaster",
    LightPact = "lightPact",
    LoneLion = "loneLion",
    MagicFusion = "magicFusion",
    Mantra = "mantra",
    MartialArts = "martialArts",
    MartialCombat = "martialCombat",
    MartialFlow = "martialFlow",
    MeiaSynchro = "meiaSynchro",
    Misfortune = "misfortune",
    Overdrive = "overdrive",
    PotentAilments = "potentAilments",
    PotentCleansing = "potentCleansing",
    PrimeSupporter = "primeSupporter",
    QuickCast = "quickCast",
    QuickRecast = "quickRecast",
    Reckoning = "reckoning",
    SicariusBestiaHunter = "sicariusBestiaHunter",
    SicariusBestiaKiller = "sicariusBestiaKiller",
    SicariusExternusHunter = "sicariusExternusHunter",
    SicariusExternusKiller = "sicariusExternusKiller",
    SicariusImperatorHunter = "sicariusImperatorHunter",
    SicariusImperatorKiller = "sicariusImperatorKiller",
    SicariusMachinaHunter = "sicariusMachinaHunter",
    SicariusMachinaKiller = "sicariusMachinaKiller",
    SicariusMedeisBuster = "sicariusMedeisBuster",
    SicariusSuperiorBuster = "sicariusSuperiorBuster",
    SpiraHunter = "spiraHunter",
    SupportGuardBuster = "supportGuardBuster",
    SupportGuardKiller = "supportGuardKiller",
    Taijutsu = "taijutsu",
    TriggerSynergy = "triggerSynergy",
    UltraDamageEscalation = "ultraDamageEscalation",
    UltraDefenseBreaker = "ultraDefenseBreaker",
    UltraGuardBreaker = "ultraGuardBreaker",
    UltraConvergence = "ultraConvergence",
    UltraElementTap = "ultraElementTap",
    UltraImprovedCriticals = "ultraImprovedCriticals",
    UltraMartialCombat = "ultraMartialCombat",
    UnityStrike = "unityStrike",
    Veil = "veil",
    VitalityTap = "vitalityTap",
    WaterPact = "waterPact",
    WeaknessBreaker = "weaknessBreaker",
    WindPact = "windPact",
}

// Hidden values on cards
enum InnateSkill {
    ExploitWeakness = "exploitWeakness",
    ImprovedCriticals = "improvedCriticals",
    PainfulBreak = "painfulBreak",
}

interface Effect {
    name: Boon | Ailment;
    duration: number;
    target: Target;
    timing: "before" | "after";
    type?: "square" | "hexagon";
}

interface BattleEffect {
    name: Boon | Ailment;
    type: "square" | "hexagon";
    duration: number;
    resistancePoints?: number;
}

interface BattleNodeInfo {
    enemies: Array<Array<Enemy>>;
    difficulty: number;
    battleResources: Record<string, string>;
    activeDeck: 0 | 1;
}

interface DamageToEnemies {
    enemyIndex: number;
    hits: Array<{
        damage: number;
        critical?: boolean;
        weakness?: boolean;
        broken?: boolean;
    }>;
}

export { BattleAction, Boon, Ailment, AutoAbility, ExtraSkill, InnateSkill };
export type {
    BattleFullDeck,
    BattleDeck,
    BattleJob,
    BattleInfo,
    Effect,
    BattleEffect,
    BattleNodeInfo,
    DamageToEnemies,
};
