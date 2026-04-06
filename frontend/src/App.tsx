import { useState } from 'react';
import FloatingControlBar from "./components/FloatingControlBar";
import IconButton from "./components/IconButton";
import ReadingCanvas from "./components/ReadingCanvas";

import "./styles/App.css"
import ListItem from "./components/ListItem.tsx";

export default function App(){
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleTogglePlay(){ setIsPlaying(!isPlaying); }
    function handleToggleMenu(){ setIsMenuOpen(!isMenuOpen); }

    return (
        <>
            <ReadingCanvas />

            <FloatingControlBar
                isMenuOpen={isMenuOpen}

                bar_children={
                    <>
                        <IconButton icon="rewind" />
                        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay} />
                        <IconButton icon="forward" />
                        <div style={{ flexGrow: 1 }}/>
                        <IconButton icon="more" onClick={handleToggleMenu} />
                    </>
                }

                menu_children={
                    <>
                        <ListItem title="Hello 1" onClick={handleToggleMenu}/>
                        <ListItem title="Hello 2" onClick={handleToggleMenu}/>
                        <ListItem hasEndArrow={true} title="Back" onClick={handleToggleMenu}/>

                    </>
                }
            />
        </>
    )
}