import * as React from 'react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import "./styles/App.css"
import type { ActionMenuItem, MenuItem, PanelState, SentenceItem } from "./Types.ts";
import ReadingCanvas from "./components/ReadingCanvas.tsx";
import Menu from "./components/Menu.tsx";
import FloatingControlBar from "./components/FloatingControlBar.tsx";
import BarItems from "./components/BarItems.tsx";
import UserMenuItems from "./components/UserMenuItems.tsx";
import { SpeechManager, SpeechEngine, ReadingSpeed } from "./services/SpeechManager";

const canvasRef = React.createRef<HTMLDivElement>()

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

const tts = new SpeechManager(SpeechEngine.NATIVE);

export default function App() {
    const [selectedEngine, setSelectedEngine] = useState<SpeechEngine>(SpeechEngine.NATIVE);
    const [sentences, setSentences] = useState<SentenceItem[]>([]);
    const [currentSentenceID, setCurrentSentenceID] = useState<string>("-1");
    const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [settingsStack, setSettingsStack] = useState<MenuItem[][]>([]);
    const [playButtonState, setPlayButtonState] = useState(false);
    const [textChanged, setTextChanged] = useState<boolean>(false);
    const [showWordBar, setShowWordBar] = useState(false);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(ReadingSpeed.NORMAL);

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
    const readSpeedRef = useRef<ReadingSpeed>(ReadingSpeed.NORMAL);

    useEffect(() => { sentenceIdRef.current = currentSentenceID; }, [currentSentenceID]);
    useEffect(() => { playStateRef.current = playButtonState; }, [playButtonState]);
    useEffect(() => { readSpeedRef.current = readingSpeed; }, [readingSpeed]);

    canvasRef.current?.addEventListener("input", (event) => {
        setTextChanged(true);
    })

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

    function handleEngineChange(engine: SpeechEngine) {
        tts.setEngine(engine);
        setSelectedEngine(engine);
    }

    function handleSegmentation(): SentenceItem[] {
        if (!canvasRef.current) return [];

        let sentenceIdCounter = 0;
        const text = canvasRef.current.textContent ?? "";
        const segmenter = new Intl.Segmenter("en", { granularity: "sentence" })
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
        tts.cancel();
        const activeSentences = freshSentences ?? sentences;
        const startIndex = activeSentences.findIndex(s => !s.isNewline && s.id === targetID);
        if (startIndex === -1) return;

        const sentenceToPlay = activeSentences[startIndex];

        tts.speak(
            sentenceToPlay.text,
            voiceRef.current,
            readSpeedRef.current,
            (charIndex, charLength) => {
                setCurrentSentenceID(sentenceToPlay.id!);
                setCurrentWord(sentenceToPlay.text.slice(charIndex, charIndex + charLength) ?? "");
            },
            () => {
                const nextValidSentence = activeSentences.slice(startIndex + 1).find(s => !s.isNewline);
                if (nextValidSentence) {
                    handlePlayback(nextValidSentence.id, activeSentences);
                } else {
                    setPlayButtonState(false);
                    setCurrentSentenceID("-1");
                }
            }
        );
    }

    const settingsMenu: MenuItem[] = [
        {
            label: "App Theme",
            icon: "colorpicker",
            submenu: [
                {
                    kind: "colorPicker",
                    label: "App Background",
                    value: theme.appBackground,
                    onChange: updateThemeColor("appBackground")
                },
                {
                    kind: "colorPicker",
                    label: "Control/Word Bar",
                    value: theme.floatingBarBackground,
                    onChange: updateThemeColor("floatingBarBackground")
                },
                {
                    kind: "colorPicker",
                    label: "Canvas Top",
                    value: theme.canvasColor1,
                    onChange: updateThemeColor("canvasColor1")
                },
                {
                    kind: "colorPicker",
                    label: "Canvas Bottom",
                    value: theme.canvasColor2,
                    onChange: updateThemeColor("canvasColor2")
                },
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
                {
                    label: "0.5x", action: () => {
                        setReadingSpeed(ReadingSpeed.SLOWEST);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.SLOWEST
                },
                {
                    label: "0.75x", action: () => {
                        setReadingSpeed(ReadingSpeed.SLOW);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.SLOW
                },
                {
                    label: "1x", action: () => {
                        setReadingSpeed(ReadingSpeed.NORMAL);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.NORMAL
                },
                {
                    label: "1.25x", action: () => {
                        setReadingSpeed(ReadingSpeed.FAST);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.FAST
                },
                {
                    label: "1.5x", action: () => {
                        setReadingSpeed(ReadingSpeed.FASTER);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.FASTER
                },
                {
                    label: "2x", action: () => {
                        setReadingSpeed(ReadingSpeed.FASTEST);
                        closeMenu();
                        handlePlayback(sentenceIdRef.current);
                    }, selected: readingSpeed == ReadingSpeed.FASTEST
                }
            ],
        },
        {
            label: "Voices",
            submenu: voices.map((value): MenuItem => {
                return {
                    label: value.name,
                    action: () => {
                        setCurrentVoice(value);
                        voiceRef.current = value;
                        closeMenu();

                        if (sentenceIdRef.current !== "-1") {
                            handlePlayback(sentenceIdRef.current);

                            if (!playStateRef.current) {
                                setTimeout(() => tts.pause(), 50);
                            }
                        }
                    },
                    selected: currentVoice ? currentVoice.name == value.name : false
                }
            })
        },
        {
            label: "Speech Engine",
            submenu: [
                {
                    label: "Native Browser TTS",
                    action: () => { handleEngineChange(SpeechEngine.NATIVE); closeMenu(); },
                    selected: selectedEngine === SpeechEngine.NATIVE
                },
                {
                    label: "Piper TTS",
                    action: () => { handleEngineChange(SpeechEngine.PIPER); closeMenu(); tts.test("this is a test") },
                    selected: selectedEngine === SpeechEngine.PIPER
                }
            ]
        },
        {
            label: showWordBar ? "Hide WordBar" : "Show WordBar",
            action: () => {
                setShowWordBar(!showWordBar);
                closeMenu();
            },
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
            tts.pause();
            setPlayButtonState(false);
        } else {
            if (tts.isPaused() && !textChanged) {
                tts.resume();
            } else {
                setTextChanged(false);
                tts.cancel();
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
            <ReadingCanvas currentWord={currentWord} barShown={showWordBar}
                           currentSentenceID={currentSentenceID.toString()} onClick={(id: number) => {
                handlePlayback(id.toString())
            }} sentences={sentences} isPlaying={playButtonState} canvasRef={canvasRef}/>
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