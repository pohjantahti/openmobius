import { useState, useRef } from "react";
import { getResourceURL } from "../../extractor";

declare global {
    interface Window {
        playMusic: any;
        playSound: any;
    }
}

// TODO: Remake this to use Audio() for music and sounds
// No need to use HTML elements since they aren't even visible

function AudioPlayer() {
    const [music, setMusic] = useState("");
    const [currentMusic, setCurrentMusic] = useState("");
    const [startLoop, setStartLoop] = useState(0);
    const [endLoop, setEndLoop] = useState(0);
    const [sound, setSound] = useState("");
    // TODO: Functionality to change volume setting
    const volume = 0;
    const musicRef = useRef<HTMLAudioElement>(null);
    const soundRef = useRef<HTMLAudioElement>(null);

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
        </>
    );
}

export default AudioPlayer;
