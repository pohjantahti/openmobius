function SocialInfo() {
    return (
        <>
            <div
                style={{
                    height: "33.47rem",
                    width: "41.67rem",
                    marginTop: "-0.5rem",
                    marginBottom: "0.5rem",
                }}
            >
                {/* Daily mission info */}
                <div style={{ marginBottom: "0.3rem" }}>
                    <div>
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.4rem",
                                margin: "-1rem 0 -0.4rem",
                            }}
                        >
                            Daily Mission
                        </p>
                    </div>
                    <div
                        style={{
                            height: "17.23rem",
                            width: "40.9rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #FFFFFFAA",
                            backgroundColor: "#00000033",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0.3rem 0.53rem 0 0.35rem",
                        }}
                    >
                        {/* TODO: Daily mission */}
                    </div>
                </div>
                {/* Recently online info */}
                <div>
                    <div>
                        <p
                            style={{
                                color: "#FFFFFF",
                                fontSize: "1.4rem",
                                margin: "0 0 -0.4rem",
                            }}
                        >
                            Recently Online
                        </p>
                    </div>
                    <div
                        style={{
                            height: "13.75rem",
                            width: "41.67rem",
                            borderRadius: "0.4rem",
                            border: "1px solid #FFFFFFAA",
                            backgroundColor: "#00000033",
                        }}
                    >
                        {/* TODO: Recently online */}
                    </div>
                </div>
            </div>
            <div
                style={{
                    height: "2rem",
                    width: "41.67rem",
                }}
            />
        </>
    );
}

export default SocialInfo;
