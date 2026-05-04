import {useState, type CSSProperties, useEffect} from 'react';
import "./styles/App.css"
import type {ActionMenuItem, MenuItem, PanelState, SentenceItem} from "./Types.ts";
import ReadingCanvas from "./components/ReadingCanvas.tsx";
import Menu from "./components/Menu.tsx";
import FloatingControlBar from "./components/FloatingControlBar.tsx";
import BarItems from "./components/BarItems.tsx";
import UserMenuItems from "./components/UserMenuItems.tsx";
import * as React from "react";


const canvasRef = React.createRef<HTMLDivElement>();
let childCount = 0;

type ThemeState = {
    appBackground: string;
    floatingBarBackground: string;
    canvasColor1: string;
    canvasColor2: string;
};

const defaultTheme: ThemeState = {
    appBackground: "#a6d4ff",
    floatingBarBackground: "#0b102f",
    canvasColor1: "#091f55",
    canvasColor2: "#357cc7",
}


export default function App() {

    const [sentences, setSentences] = useState<SentenceItem[]>([]);
    const [currentSentenceID, setCurrentSentenceID] = useState<string>("-1");
    const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice>(speechSynthesis.getVoices()[0]);

    const [settingsStack, setSettingsStack] = useState<MenuItem[][]>([]);
    const [playButtonState, setPlayButtonState] = useState(false);
    const [theme, setTheme] = useState<ThemeState>({
        appBackground: "#a6d4ff",
        floatingBarBackground: "#0b102f",
        canvasColor1: "#091f55",
        canvasColor2: "#357cc7",
    });
    const [panelState, setPanelState] = useState<PanelState>("closed")


    function updateThemeColor(key: keyof ThemeState) {
        return (value: string) => {
            setTheme((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        };

    }

    function resetThemeColor() {
        setTheme(defaultTheme)
    }

    function handleSegmentation(): SentenceItem[] {
        childCount = 0;
        const text = canvasRef.current!.textContent;
        const segmenter = new Intl.Segmenter("en", {granularity: "sentence"})
        const segments = Array.from(segmenter.segment(text!));
        const newSentences = segments.map((seg, index): SentenceItem => {
            if (seg.segment === "\n") {
                return {
                    id: "", text: "",
                    isNewline: true,
                    key: `${index}` };
            }
            return {
                isNewline: false,
                text: seg.segment,
                id: (childCount++).toString(),
                key: `${index}`,
            }
        });
        setSentences(newSentences);
        return newSentences;
    }

    function handlePlayback(targetID: string, freshSentences?: SentenceItem[]) {
        speechSynthesis.cancel();

        // if fresh sentences use them otherwise use the state
        const activeSentences = freshSentences || sentences;

        const startIndex = activeSentences.findIndex(s => !s.isNewline && s.id === targetID);

        if (startIndex === -1) return;

        const remainingSentences = activeSentences.slice(startIndex);

        for (const sentence of remainingSentences) {
            if (sentence.isNewline) continue;

            const utterance = new SpeechSynthesisUtterance(sentence.text);

            utterance.voice = currentVoice;

            utterance.onboundary = () => {
                setCurrentSentenceID(sentence.id!);
            };

            speechSynthesis.speak(utterance);
        }


    }
    useEffect(() => {
        if (playButtonState && currentSentenceID !== "-1") {
            handlePlayback(currentSentenceID);
        }
    }, [currentVoice]);

    useEffect(() => {
        if (playButtonState) {
            if (speechSynthesis.paused) {speechSynthesis.resume(); return}
            const newSentences = handleSegmentation();
            handlePlayback('0', newSentences);
        } else {
            speechSynthesis.pause()
        }
    }, [playButtonState])

    const settingsMenu: MenuItem[] = [
        {
            label: "App Theme",
            icon: "colorpicker",
            submenu: [
                {
                    kind: "colorPicker",
                    label: "App Background",
                    value: theme.appBackground,
                    onChange: updateThemeColor("appBackground"),
                },
                {
                    kind: "colorPicker",
                    label: "Control Bar",
                    value: theme.floatingBarBackground,
                    onChange: updateThemeColor("floatingBarBackground"),
                },
                {
                    kind: "colorPicker",
                    label: "Canvas Top",
                    value: theme.canvasColor1,
                    onChange: updateThemeColor("canvasColor1"),
                },
                {
                    kind: "colorPicker",
                    label: "Canvas Bottom",
                    value: theme.canvasColor2,
                    onChange: updateThemeColor("canvasColor2"),
                },
                {
                    kind: "action",
                    label: "Reset Theme",
                    action: resetThemeColor
                },
            ],
        },
        {
            label: "Upload File",
            icon: "upload",
            action: () => console.log("upload"),
        },
        {
            label: "Reading Speed",
            icon: "speed",
            submenu: [
                {label: "Slow", action: () => console.log("slow")},
                {label: "Normal", action: () => console.log("normal")},
                {label: "Fast", action: () => console.log("fast")},
            ],
            action: () => console.log("Action"),
        },
        {
            label: "Voices",
            submenu:
                speechSynthesis.getVoices().map((value): MenuItem => {
                    return {
                        label: value.name,
                        action: () => {setCurrentVoice(value); closeMenu();},
                        selected: currentVoice ? currentVoice.name == value.name : false
                    }
                })

        },
        {
            label: "Language"
        }
    ];
    const themeVars = {
        "--app-background": theme.appBackground,
        "--floating-bar-background": theme.floatingBarBackground,
        "--canvasColor1": theme.canvasColor1,
        "--canvasColor2": theme.canvasColor2,
    } as CSSProperties;

    function togglePlay() {
        setPlayButtonState(prevState => !prevState);
    }

    function openSettings() {
        setSettingsStack([settingsMenu]);
        setPanelState("settings");
    }

    function closeMenu() {
        setPanelState("closed");
        setTimeout(() => {
            setSettingsStack([]);
        }, 500); // need to wait for animation to finish, then reset the stack
    }

    function handleMenuItemClick(item: ActionMenuItem) {
        const submenu = item.submenu;

        if (submenu) {
            setSettingsStack(prev => [...prev, submenu]);
        } else {
            item.action?.();
        }
    }

    function handleForwardBackward(value: string) {
        let targetIdNumber = value === "f"
            ? Number(currentSentenceID) + 1
            : Number(currentSentenceID) - 1;

        if (targetIdNumber < 0) targetIdNumber = 0;

        handlePlayback(targetIdNumber.toString());
    }

    function handleBack() {
        if (settingsStack.length === 1) {
            closeMenu();
            return;
        }
        setSettingsStack(prev => prev.slice(0, -1));
    }

    return (
        <div className="appShell" style={themeVars}>
            <ReadingCanvas currentSentenceID={currentSentenceID.toString()} onClick = {(id: number)=> { handlePlayback(id.toString())} } sentences={sentences} isPlaying={playButtonState} canvasRef={canvasRef}/>
            <FloatingControlBar
                panelState={panelState}

                bar={
                    <BarItems
                        handleForwardBackward={handleForwardBackward}
                        onOpenSettingsMenu={() => openSettings()}
                        onOpenUserMenu={() => {
                            setPanelState("user")
                        }}
                        handleTogglePlay={togglePlay}
                        isPlaying={playButtonState}
                    />
                }
                menu={
                    <Menu
                        items={settingsStack.at(-1) ?? []}
                        onItemClick={handleMenuItemClick}
                        onBack={handleBack}
                        canGoBack={settingsStack.length > 1}
                    />
                }
                user={
                    <UserMenuItems onBack={closeMenu}/>
                }
            />
        </div>
    );
}
