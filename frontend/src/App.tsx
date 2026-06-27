import {useState, type CSSProperties, useEffect, useRef} from 'react';
import "./styles/App.css"
import type {ActionMenuItem, MenuItem, PanelState, SentenceItem} from "./Types.ts";
import ReadingCanvas from "./components/ReadingCanvas.tsx";
import Menu from "./components/Menu.tsx";
import FloatingControlBar from "./components/FloatingControlBar.tsx";
import BarItems from "./components/BarItems.tsx";
import UserMenuItems from "./components/UserMenuItems.tsx";
import * as React from "react";

const canvasRef = React.createRef<HTMLDivElement>();

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
    const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [settingsStack, setSettingsStack] = useState<MenuItem[][]>([]);
    const [playButtonState, setPlayButtonState] = useState(false);
    const [showWordBar, setShowWordBar] = useState(false);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [readingSpeed, setReadingSpeed] = useState<0.5 | 0.75 | 1 | 1.25 | 1.5 | 2>(1);

    const [theme, setTheme] = useState<ThemeState>({
        appBackground: "#a6d4ff",
        floatingBarBackground: "#0b102f",
        canvasColor1: "#091f55",
        canvasColor2: "#357cc7",
    });
    const [panelState, setPanelState] = useState<PanelState>("closed")

    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const sentenceIdRef = useRef<string>("-1");
    const playStateRef = useRef<boolean>(false);

    useEffect(() => { sentenceIdRef.current = currentSentenceID; }, [currentSentenceID]);
    useEffect(() => { playStateRef.current = playButtonState; }, [playButtonState]);

    useEffect(() => {
        const updateVoices = () => {
            const loadedVoices = speechSynthesis.getVoices();
            setVoices(loadedVoices);
            if (loadedVoices.length > 0) {
                setCurrentVoice(prev => {
                    const newVoice = prev ? prev : loadedVoices[0];
                    voiceRef.current = newVoice;
                    return newVoice;
                });
            }
        };
        updateVoices();
        speechSynthesis.addEventListener("voiceschanged", updateVoices);
        return () => speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    }, []);

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
        if (!canvasRef.current) return [];

        let sentenceIdCounter = 0;
        const text = canvasRef.current.textContent ?? "";
        const segmenter = new Intl.Segmenter("en", {granularity: "sentence"})
        const segments = Array.from(segmenter.segment(text));

        const newSentences = segments.map((seg, index): SentenceItem => {
            if (seg.segment === "\n") {
                return {
                    id: "", text: "",
                    isNewline: true,
                    key: `${index}`
                };
            }
            return {
                isNewline: false,
                text: seg.segment,
                id: (sentenceIdCounter++).toString(),
                key: `${index}`,
            }
        });
        setSentences(newSentences);
        return newSentences;
    }

    function handlePlayback(targetID: string, freshSentences?: SentenceItem[]) {
        speechSynthesis.cancel();
        const activeSentences = freshSentences ?? sentences;
        const startIndex = activeSentences.findIndex(s => !s.isNewline && s.id === targetID);
        if (startIndex === -1) return;

        const sentenceToPlay = activeSentences[startIndex];
        const utterance = new SpeechSynthesisUtterance(sentenceToPlay.text);

        if (voiceRef.current) {
            utterance.voice = voiceRef.current;
        }

        utterance.rate = readingSpeed;
        utterance.onboundary = (x) => {
            setCurrentSentenceID(sentenceToPlay.id!);
            setCurrentWord(sentenceToPlay.text.slice(x.charIndex, x.charIndex+x.charLength) ?? "Word Bar Unsupported on Platform");

        };

        utterance.onend = () => {
            const nextValidSentence = activeSentences.slice(startIndex + 1).find(s => !s.isNewline);
            if (nextValidSentence) {
                handlePlayback(nextValidSentence.id, activeSentences);
            } else {
                setPlayButtonState(false);
                setCurrentSentenceID("-1");
            }
        };

        speechSynthesis.speak(utterance);
    }

    const settingsMenu: MenuItem[] = [
        {
            label: "App Theme",
            icon: "colorpicker",
            submenu: [
                { kind: "colorPicker", label: "App Background", value: theme.appBackground, onChange: updateThemeColor("appBackground") },
                { kind: "colorPicker", label: "Control/Word Bar", value: theme.floatingBarBackground, onChange: updateThemeColor("floatingBarBackground") },
                { kind: "colorPicker", label: "Canvas Top", value: theme.canvasColor1, onChange: updateThemeColor("canvasColor1") },
                { kind: "colorPicker", label: "Canvas Bottom", value: theme.canvasColor2, onChange: updateThemeColor("canvasColor2") },
                { kind: "action", label: "Reset Theme", action: resetThemeColor },
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
                {label: "0.5x", action: () => {
                        setReadingSpeed(0.5);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current); //restart from current sentence
                    }, selected: readingSpeed == 0.5},
                {label: "0.75x", action: () => {
                        setReadingSpeed(0.75);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);

                    }, selected: readingSpeed == 0.75},
                {label: "1x", action: () => {
                        setReadingSpeed(1);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);

                    }, selected: readingSpeed == 1},
                {label: "1.25x", action: () => {
                    setReadingSpeed(1.25);
                    closeMenu();
                    handlePlayback(sentenceIdRef.current);

                    }, selected: readingSpeed == 1.25},
                {label: "1.5x", action: () => {
                setReadingSpeed(1.5);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
                }, selected: readingSpeed == 1.5
                },
                {label: "2x", action: () => {
                    setReadingSpeed(2);
                    closeMenu();
                    handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == 2}

            ],
        },
        {
            label: "Voices",
            submenu:
                voices.map((value): MenuItem => {
                    return {
                        label: value.name,
                        action: () => {
                            setCurrentVoice(value);
                            voiceRef.current = value;
                            closeMenu();

                            if (sentenceIdRef.current !== "-1") { //apply new voice
                                handlePlayback(sentenceIdRef.current);

                                // if  paused  make sure the new voice utterance is also paused
                                if (!playStateRef.current) {
                                    setTimeout(() => speechSynthesis.pause(), 50);
                                }
                            }
                        },
                        selected: currentVoice ? currentVoice.name == value.name : false
                    }
                })

        },
        {
            label: "Language"
        },
        {label: showWordBar ? "Hide WordBar" : "Show WordBar",
            action: () => {setShowWordBar(!showWordBar); closeMenu(); },

        }
    ];

    const themeVars = {
        "--app-background": theme.appBackground,
        "--floating-bar-background": theme.floatingBarBackground,
        "--canvasColor1": theme.canvasColor1,
        "--canvasColor2": theme.canvasColor2,
    } as CSSProperties;

    function togglePlay() {
        if (playButtonState) {
            speechSynthesis.pause();
            setPlayButtonState(false);
        } else {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            } else {
                const newSentences = handleSegmentation();
                handlePlayback('0', newSentences);
            }
            setPlayButtonState(true);
        }
    }

    function openSettings() {
        setSettingsStack([settingsMenu]);
        setPanelState("settings");
    }

    function closeMenu() {
        setPanelState("closed");
        setTimeout(() => {
            setSettingsStack([]);
        }, 500);
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
            <ReadingCanvas  currentWord={currentWord} barShown={showWordBar} currentSentenceID={currentSentenceID.toString()} onClick = {(id: number)=> { handlePlayback(id.toString())} } sentences={sentences} isPlaying={playButtonState} canvasRef={canvasRef}/>
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