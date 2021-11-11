interface JobType {
    id: number;
    name: string;
    card: string;
    thumbnail: string;
    class: "warrior" | "ranger" | "mage" | "monk";
    level: number;
    overboost: number;
}

const jobs: Array<JobType> = [
    {
        id: 0,
        name: "Warrior",
        card: "Card: Warrior",
        thumbnail: "Thumbnail: Warrior",
        class: "warrior",
        level: 8,
        overboost: 0,
    },
];

export default jobs;
export type { JobType };
