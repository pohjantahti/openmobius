interface Card {
    id: number;
    name: string;
    card: string;
    thumbnail: string;
    class: "warrior" | "ranger" | "mage" | "monk" | "support";
    star: number;
    level: number;
    overboost: number;
    element: "fire" | "water" | "wind" | "earth" | "light" | "dark" | "life";
}

const cards: Array<Card> = [
    {
        id: 0,
        name: "Ares",
        card: "Card: Ares",
        thumbnail: "Thumbnail: Ares",
        class: "warrior",
        star: 5,
        level: 80,
        overboost: 0,
        element: "fire",
    },
    {
        id: 1,
        name: "Valkyrie",
        card: "Card: Valkyrie",
        thumbnail: "Thumbnail: Valkyrie",
        class: "ranger",
        star: 5,
        level: 80,
        overboost: 0,
        element: "water",
    },
    {
        id: 2,
        name: "Knights of the Round: FFVII",
        card: "Card: Knights of the Round: FFVII",
        thumbnail: "Thumbnail: Knights of the Round: FFVII",
        class: "support",
        star: 5,
        level: 80,
        overboost: 0,
        element: "life",
    },
    {
        id: 3,
        name: "A Tale of Hope",
        card: "Card: A Tale of Hope",
        thumbnail: "Thumbnail: A Tale of Hope",
        class: "support",
        star: 5,
        level: 80,
        overboost: 0,
        element: "life",
    },
];

export default cards;
export type { Card };
