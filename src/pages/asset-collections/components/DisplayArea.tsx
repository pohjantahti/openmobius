import { useEffect, useRef } from "react";
import { SceneRenderer } from "../../../renderer/sceneRenderer";

interface Props {
    jobId: string;
}

function DisplayArea(props: Props) {
    const renderer = useRef<SceneRenderer>();

    useEffect(() => {
        const handleDisplayJob = async () => {
            await renderer.current?.loadJob(props.jobId);
        };

        if (!renderer.current) {
            renderer.current = new SceneRenderer("jobDisplay", 700, 900);
        } else if (props.jobId.length > 0) {
            handleDisplayJob();
        }
    }, [props.jobId]);

    return (
        <>
            <div id="jobDisplay" />
        </>
    );
}

export default DisplayArea;
