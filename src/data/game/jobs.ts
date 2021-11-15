import { Element, JobClass } from "../../info/types";

interface Job {
    id: number;
    name: string;
    card: string;
    thumbnail: string;
    class: JobClass;
    level: number;
    overboost: number;
    elements: [Element, Element, Element];
}

const jobs: Array<Job> = [
    {
        id: 0,
        name: "Warrior",
        card: "Card: Warrior",
        thumbnail: "Thumbnail: Warrior",
        class: "warrior",
        level: 8,
        overboost: 0,
        elements: ["fire", "water", "earth"],
    },
];

export default jobs;
export type { Job };
