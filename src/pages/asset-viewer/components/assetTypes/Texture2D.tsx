interface Props {
    url: string;
}

function Texture2D(props: Props) {
    return <img src={props.url} style={{ maxHeight: "100%", maxWidth: "100%" }} />;
}

export default Texture2D;
