import JobRenderer from "@renderer/JobRenderer";

interface Props {
    jobId: string;
}

function DisplayArea(props: Props) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div id="jobDisplay" />
            <div style={{ height: 700, width: 700 }}>
                <JobRenderer jobId={props.jobId} />
            </div>
        </div>
    );
}

export default DisplayArea;
