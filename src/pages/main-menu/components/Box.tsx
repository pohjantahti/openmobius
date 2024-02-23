interface Props {
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

function Box(props: Props) {
    return (
        <div
            style={{
                ...props.style,
                backgroundColor: props.style?.backgroundColor || "#3D3D3D",
                borderRadius: props.style?.borderRadius || 10,
                color: props.style?.color || "#E5E5E5",
            }}
        >
            {props.children}
        </div>
    );
}

export default Box;
