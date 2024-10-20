interface JobInfo {
    id: number;
    name: string;
    class: string;
    stats: {
        hp: number;
        attack: number;
        breakPower: number;
        magic: number;
        critical: number;
        speed: number;
        defense: number;
    };
    elements: Array<string>;
}

interface CardInfo {
    id: number;
    name: string;
    class: string;
    element: string;
    ability: {
        name: string;
        cost: number;
        attack: number;
        breakPower: number;
        critical: number;
        target: string;
        hits: number;
        cooldown?: number;
    };
}

interface WeaponInfo {
    id: number;
    name: string;
    stats: {
        hp: number;
        attack: number;
        breakPower: number;
        magic: number;
        critical: number;
        speed: number;
        defense: number;
    };
}

interface EnemyInfo {
    id: number;
    name: string;
    element: string;
    hp: number;
    breakGauge: {
        yellow: number;
        red: number;
    };
    attack: number;
    defense: number;
}

export type { JobInfo, CardInfo, WeaponInfo, EnemyInfo };
