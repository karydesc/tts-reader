import { useState } from 'react';
import FloatingControlBar from "./components/FloatingControlBar";
import IconButton from "./components/IconButton";
import ReadingCanvas from "./components/ReadingCanvas";

import "./styles/index.css"


export default function App(){
    const [isPlaying, setIsPlaying] = useState(false);

    function handleTogglePlay(){
        setIsPlaying(!isPlaying);
    }

    return (
    <>
    <ReadingCanvas/>
    <FloatingControlBar>
        <IconButton icon="rewind" />
        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay} />
        <IconButton icon="forward" />

        <div style={{ flexGrow: 1 }}></div> {/*spacer*/}
        
        <IconButton icon="more" />
    </FloatingControlBar>
    </>
    )
}