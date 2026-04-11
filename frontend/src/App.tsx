import {useState} from 'react';
import "./styles/App.css"
import type { MenuItem } from "./MenuItem.ts";
import ReadingCanvas from "./components/ReadingCanvas.tsx";
import Menu from "./components/Menu.tsx";
import FloatingControlBar from "./components/FloatingControlBar.tsx";
import BarItems from "./components/BarItems.tsx";


const SettingsMenu: MenuItem[] = [
    {
        label: "App Theme",
        icon: "colorpicker",
        submenu: [
            { label: "Light", action: () => console.log("light") },
            { label: "Dark", action: () => console.log("dark") },
        ]
    },
    {
        label: "Upload File",
        icon: "upload",
        action: () => console.log("upload")
    },
    {
        label: "Reading Speed",
        icon: "speed",
        submenu: [
            { label: "Slow", action: () => console.log("slow") },
            { label: "Normal", action: () => console.log("normal") },
            { label: "Fast", action: () => console.log("fast") },
        ],
        action: () => console.log("Action")
    }
];





export default function App() {
    const [menuStack, setMenuStack] = useState<MenuItem[][]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shouldRenderMenu, renderMenuItems] = useState(false);

    function togglePlay() {
        setIsPlaying(prevState => !prevState);
    }

    function openMenu(root: MenuItem[]) {
        setMenuStack([root]);
        renderMenuItems(true);
    }

    function closeMenu() {
        renderMenuItems(false);
        setTimeout(() => {
            setMenuStack([]);
        }, 300); // match animation
    }

    function handleMenuItemClick(item: MenuItem) {
        if (item.submenu) {
            setMenuStack(prev => [...prev, item.submenu!]);
        } else {
            item.action?.();
        }
    }

    function handleBack() {
        if (menuStack.length == 1) { // if we
            closeMenu();
            return;
        }
        setMenuStack(prev => prev.slice(0, -1));
    }
    return (
        <>
            <ReadingCanvas isPlaying={isPlaying} />
            <FloatingControlBar
                shouldRenderMenu={shouldRenderMenu}
                bar={
                    <BarItems
                        onOpenSettingsMenu={()=>{openMenu(SettingsMenu)}}
                        onOpenUserMenu={()=>{}}
                        handleTogglePlay={togglePlay}
                        isPlaying={isPlaying}
                    />
                }
                menu={
                    <Menu
                        items={menuStack.at(-1) ?? []}
                        onItemClick={handleMenuItemClick}
                        onBack={handleBack}
                        canGoBack={menuStack.length > 1}
                    />
                }
            />
        </>
    );}
