import { MapNodeType } from "../../data/game/regions";
import { resources } from "../../extractor";

interface Props {
    node: MapNodeType;
    nodeInfo: Array<MapNodeType>;
}

function MapPaths(props: Props) {
    const { node, nodeInfo } = props;

    // TODO: Add other path types
    const types: Record<string, string> = {
        normal: "Icon: Map_PathNormal",
    };

    const paths: Array<{
        type: string;
        top: number;
        left: number;
        height: number;
        width: number;
        rotate: number;
    }> = [];

    // TODO: Add option to add waypoints/corners to paths (to make angled paths)
    // Array of coordinates that get chosen as from and to variables below

    node.mapInfo.paths?.forEach((path) => {
        const from = node.mapInfo.position;
        const to = nodeInfo.filter((node) => node.id === path.to)[0].mapInfo.position;

        if (from && to) {
            // Distance between "from" and "to" coordinates
            const width = Math.sqrt(
                Math.pow(to[0] + 6 - (from[0] + 6), 2) + Math.pow(to[1] + 2 - (from[1] + 2), 2)
            );
            // Angle of line from "from" to "to"
            const deltaX = to[0] - from[0];
            const deltaY = to[1] - from[1];
            const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

            paths.push({
                type: types[path.type],
                top: from[1] + 2,
                left: from[0] + 6.2,
                height: path.height ? path.height : 2,
                width: width,
                rotate: angle,
            });
        } else {
            console.warn(`"to" id ${path.to} used in node ${node.id} not present in current map`);
        }
    });

    return (
        <>
            {paths.map((path, index: number) => (
                <img
                    key={index}
                    src={resources[path.type]}
                    style={{
                        position: "absolute",
                        top: `${path.top}rem`,
                        left: `${path.left}rem`,
                        height: `${path.height}rem`,
                        width: `${path.width}rem`,
                        transform: `rotate(${path.rotate}deg)`,
                        transformOrigin: "left",
                    }}
                />
            ))}
        </>
    );
}

export default MapPaths;
