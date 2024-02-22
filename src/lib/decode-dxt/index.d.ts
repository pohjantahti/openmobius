declare function decode(
    imageDataView: DataView,
    width: number,
    height: number,
    format: "dxt1" | "dxt2" | "dxt3" | "dxt4" | "dxt5"
): Uint8Array;

export default decode;
