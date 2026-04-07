import { useState } from 'react';
import FloatingControlBar from "./components/FloatingControlBar";
import ReadingCanvas from "./components/ReadingCanvas";
import MenuItems from "./components/MenuItems"
import "./styles/App.css"
import BarItems from "./components/BarItems";

export default function App(){
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    // const [isUserMen .uOpen, setIsUserMenuOpen] = useState(false);

    function handleTogglePlay(){ setIsPlaying(prev => !prev); }
    function handleToggleMoreMenu(){ setIsMoreMenuOpen(prev => !prev); }
    // function handleToggleUserMenu(){ setIsUserMenuOpen(!isUserMenuOpen); }

    return (
        <>
            <ReadingCanvas />

            <FloatingControlBar
                isMenuOpen={isMoreMenuOpen}
                bar={<BarItems isPlaying={isPlaying} handleToggleMoreMenu={handleToggleMoreMenu} handleTogglePlay={handleTogglePlay} />}
                menu={<MenuItems handleToggleMoreMenu={handleToggleMoreMenu}/>}
            />
        </>
    )
}
