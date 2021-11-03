interface Region {
    id: number;
    name: string;
    music: string;
    startingLocation?: number;
    nodes: Array<MapNodeType>;
}

interface MapNodeType {
    id: number;
    name: string;
    battleInfo: {
        stamina: number;
        battles: number;
    };
    mapInfo: {
        position: Array<number>;
        color: "red" | "green" | "yellow" | "black" | "blue" | "orange";
        completed: boolean;
        paths?: Array<{
            to: number;
            type: "normal";
            height?: number;
        }>;
    };
}

const regions: Array<Region> = [
    {
        id: 0,
        name: "Tower",
        music: "Music: Tower",
        startingLocation: 5,
        nodes: [
            {
                id: 0,
                name: "Phantasmic Coil",
                battleInfo: {
                    stamina: 8,
                    battles: 1,
                },
                mapInfo: {
                    position: [70, 15],
                    color: "red",
                    completed: true,
                    paths: [
                        {
                            to: 1,
                            type: "normal",
                        },
                    ],
                },
            },
            {
                id: 1,
                name: "Phantasmic Coil",
                battleInfo: {
                    stamina: 8,
                    battles: 8,
                },
                mapInfo: {
                    position: [84, 15],
                    color: "red",
                    completed: true,
                },
            },
            {
                id: 2,
                name: "Phantasmic Coil",
                battleInfo: {
                    stamina: 8,
                    battles: 8,
                },
                mapInfo: {
                    position: [94, 22],
                    color: "red",
                    completed: true,
                    paths: [
                        {
                            to: 1,
                            type: "normal",
                        },
                    ],
                },
            },
            {
                id: 3,
                name: "Phantasmic Coil",
                battleInfo: {
                    stamina: 8,
                    battles: 8,
                },
                mapInfo: {
                    position: [60, 22],
                    color: "red",
                    completed: true,
                    paths: [
                        {
                            to: 0,
                            type: "normal",
                        },
                    ],
                },
            },
            {
                id: 4,
                name: "Phantasmic Coil",
                battleInfo: {
                    stamina: 8,
                    battles: 8,
                },
                mapInfo: {
                    position: [77, 26],
                    color: "red",
                    completed: true,
                    paths: [
                        {
                            to: 3,
                            type: "normal",
                        },
                        {
                            to: 2,
                            type: "normal",
                        },
                    ],
                },
            },
            {
                id: 5,
                name: "The Phantasm",
                battleInfo: {
                    stamina: 8,
                    battles: 8,
                },
                mapInfo: {
                    position: [77, 40],
                    color: "red",
                    completed: true,
                    paths: [
                        {
                            to: 4,
                            type: "normal",
                        },
                    ],
                },
            },
        ],
    },
];

export default regions;
export type { Region, MapNodeType };
