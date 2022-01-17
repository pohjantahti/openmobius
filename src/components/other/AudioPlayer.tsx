import { useState, useRef } from "react";
import { getResourceURL } from "../../extractor";

declare global {
    interface Window {
        playMusic: (name: string) => void;
        playSound: (name: string) => void;
    }
}

function AudioPlayer() {
    const [music, setMusic] = useState("");
    const [currentMusic, setCurrentMusic] = useState("");
    const [startLoop, setStartLoop] = useState(0);
    const [endLoop, setEndLoop] = useState(0);
    const [sound, setSound] = useState("");
    const musicRef = useRef<HTMLAudioElement>(null);
    const soundRef = useRef<HTMLAudioElement>(null);

    const [volume, setVolume] = useState(0);
    const handleVolume = (action: "music", newVolume: number) => {
        switch (action) {
            case "music":
                setVolume(newVolume);
                if (musicRef.current) {
                    musicRef.current.volume = newVolume;
                }
                break;
        }
    };

    const [showPanel, setShowPanel] = useState(false);
    const [hoverPanel, setHoverPanel] = useState(false);
    const handleControlPanel = (action: "click" | "hoverenter" | "hoverleave") => {
        switch (action) {
            case "click":
                setShowPanel(!showPanel);
                break;
            case "hoverenter":
                setHoverPanel(true);
                break;
            case "hoverleave":
                setHoverPanel(false);
                break;
        }
    };

    // Reads the Ogg Vorbis LoopStart and LoopEnd values
    // Looks and is kinda hacky but has worked so far
    const getLoopTime = async (url: string) => {
        const file = await fetch(url);
        const dataView = new DataView(await file.arrayBuffer());
        const decoder = new TextDecoder();

        // Return zeroes if LoopStart is not specified
        var bufferPart = dataView.buffer.slice(134, 143);
        if (decoder.decode(new Uint8Array(bufferPart).buffer) !== "LoopStart") {
            return [0, 0];
        }

        let position: number = 134;
        const bytes: Array<number> = [];
        while (position !== dataView.byteLength) {
            const byte = dataView.getInt8(position);
            position++;
            if (byte === 15) {
                // Skip space between StartLoop and EndLoop
                position += 3;
            } else if (byte === 1) {
                // End of EndLoop
                break;
            } else {
                bytes.push(byte);
            }
        }
        // Decoder result looks like "LoopStart=1234567LoopEnd=7654321" or "LoopStart=1234567"
        // Numbers get picked to the start array: ["1234567", "7654321"]
        const start: Array<string> = decoder.decode(new Uint8Array(bytes).buffer).match(/\d+/g)!;
        const values = [Number(start[0]) | 0, Number(start[1]) | 0];
        return values;
    };

    // Play music on loop
    window.playMusic = async (resource: string) => {
        if (currentMusic !== resource) {
            const url: string = await getResourceURL(resource);
            const [loopStart, loopEnd] = await getLoopTime(url);
            setStartLoop(loopStart / 44100);
            setEndLoop(loopEnd / 44100);
            setMusic(url);
            setCurrentMusic(resource);
            musicRef.current?.load();
            if (musicRef.current) {
                musicRef.current.volume = volume;
            }
            musicRef.current?.play();
        }
    };

    // Play a sound once, on top of music
    window.playSound = async () => {
        setSound(await getResourceURL("Music: Sword Saint"));
        soundRef.current?.load();
        soundRef.current?.play();
        if (soundRef.current) {
            soundRef.current.volume = volume;
        }
    };

    const handleTimeUpdate = () => {
        if (musicRef.current && musicRef.current.currentTime >= endLoop) {
            musicRef.current.currentTime = startLoop;
            musicRef.current.play();
        }
    };

    return (
        <>
            {endLoop > 0 ? (
                <audio ref={musicRef} onTimeUpdate={handleTimeUpdate}>
                    <source src={music} type="audio/ogg" />
                </audio>
            ) : (
                <audio ref={musicRef} loop>
                    <source src={music} type="audio/ogg" />
                </audio>
            )}
            <audio ref={soundRef}>
                <source src={sound} type="audio/ogg" />
            </audio>

            <div
                style={{
                    position: "fixed",
                    width: 50,
                    height: 50,
                    top: 0,
                    left: 0,
                    zIndex: 101,
                    display: "flex",
                    justifyContent: "center",
                    opacity: hoverPanel ? 1 : 0,
                    transition: "opacity 0.3s",
                }}
                onClick={() => handleControlPanel("click")}
                onMouseEnter={() => handleControlPanel("hoverenter")}
                onMouseLeave={() => handleControlPanel("hoverleave")}
            >
                <p
                    style={{
                        fontSize: 40,
                        lineHeight: 1,
                        color: "#E5E5E5",
                    }}
                >
                    &gt;
                </p>
            </div>

            <div
                style={{
                    position: "fixed",
                    width: 370,
                    height: 50,
                    backgroundColor: "#3D3D3D",
                    top: 0,
                    left: showPanel ? 0 : -370,
                    transition: "left 0.3s",
                    zIndex: 101,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 50,
                        height: 50,
                        display: "flex",
                        justifyContent: "center",
                    }}
                    onClick={() => handleControlPanel("click")}
                >
                    <p
                        style={{
                            fontSize: 40,
                            lineHeight: 1,
                            color: "#E5E5E5",
                        }}
                    >
                        &lt;
                    </p>
                </div>
                <div
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderRight: "2px solid #E5E5E5",
                    }}
                >
                    <p
                        style={{
                            fontSize: 17,
                            color: "#E5E5E5",
                        }}
                    >
                        Volume
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: 10,
                        width: 200,
                    }}
                >
                    <p
                        style={{
                            fontSize: 17,
                            color: "#E5E5E5",
                        }}
                    >
                        Music
                    </p>
                    <input
                        type="range"
                        value={volume}
                        min="0"
                        max="1"
                        step="0.01"
                        onChange={(event) => handleVolume("music", Number(event.target.value))}
                    />
                </div>
            </div>
        </>
    );
}

export default AudioPlayer;
