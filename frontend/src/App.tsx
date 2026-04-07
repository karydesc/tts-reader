import { useState } from 'react';
import FloatingControlBar from "./components/FloatingControlBar";
import IconButton from "./components/IconButton";
import ReadingCanvas from "./components/ReadingCanvas";

import "./styles/App.css"
import ListItem from "./components/ListItem.tsx";

export default function App(){
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    function handleTogglePlay(){ setIsPlaying(!isPlaying); }
    function handleToggleMoreMenu(){ setIsMoreMenuOpen(!isMoreMenuOpen); }
    function handleToggleUserMenu(){ setIsUserMenuOpen(!isUserMenuOpen); }

    return (
        <>
            <ReadingCanvas />

            <FloatingControlBar
                isMenuOpen={isMoreMenuOpen}

                bar_children={
                    <>
                        <IconButton icon="rewind" />
                        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay} />
                        <IconButton icon="forward" />
                        <div style={{ flexGrow: 1 }}/>
                        <IconButton icon="more" onClick={handleToggleMoreMenu} />
                        <IconButton icon="user" onClick={handleToggleUserMenu}/>

                    </>
                }
                menu_children={
                    <>
                        <ListItem rightIcon="colorpicker" text="App Theme"/>
                        <ListItem rightIcon="upload" text="Upload File"/>
                        <ListItem rightIcon="speed" text="Reading Speed"/>

                        <div style={{ flexGrow: 1 }}/>
                        <ListItem rightIcon="rightChevron" text="Return" onClick={handleToggleMoreMenu}/>
                    </>
                }
            />
        </>
    )
}
