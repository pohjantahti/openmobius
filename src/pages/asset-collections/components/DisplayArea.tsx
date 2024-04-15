import JobRenderer from "@renderer/JobRenderer";

interface Props {
    jobId: string;
}

function DisplayArea(props: Props) {
    return (
        <div style={{ height: 700, width: 700 }}>
            <JobRenderer jobId={props.jobId} />
        </div>
    );
}

export default DisplayArea;
