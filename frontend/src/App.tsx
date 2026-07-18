import * as React from 'react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import "./styles/App.css"
import type {ActionMenuItem, MenuItem, PanelState, SentenceItem, ServerVoice} from "./Types.ts";
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
};

const tts = new SpeechManager(SpeechEngine.LOCAL);

export default function App() {
    const [selectedEngine, setSelectedEngine] = useState<SpeechEngine>(SpeechEngine.LOCAL);
    const [sentences, setSentences] = useState<SentenceItem[]>([]);
    const [currentSentenceID, setCurrentSentenceID] = useState<string>("-1");

    const [currentServerVoice, setCurrentServerVoice] = useState<ServerVoice>();
    const [currentLocalVoice, setCurrentLocalVoice] = useState<SpeechSynthesisVoice>();

    const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [serverVoices, setServerVoices] = useState<ServerVoice[]>([]);

    const [menuViewStack, setMenuViewStack] = useState<string[]>([]);
    const [playButtonState, setPlayButtonState] = useState(false);
    const [textChanged, setTextChanged] = useState<boolean>(false);
    const [showWordBar, setShowWordBar] = useState(false);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(ReadingSpeed.NORMAL);

    const [theme, setTheme] = useState<ThemeState>({
        appBackground: localStorage.getItem('appBackground') ?? "#a6d4ff",
        floatingBarBackground: localStorage.getItem('floatingBarBackground') ?? "#0b102f",
        canvasColor1: localStorage.getItem('canvasColor1') ?? "#091f55",
        canvasColor2: localStorage.getItem('canvasColor2') ?? "#357cc7",
    });
    const [panelState, setPanelState] = useState<PanelState>("closed")

    const voiceRef = useRef<SpeechSynthesisVoice | ServerVoice | null>(null);
    const sentenceIdRef = useRef<string>("-1");
    const playStateRef = useRef<boolean>(false);
    const readSpeedRef = useRef<ReadingSpeed>(ReadingSpeed.NORMAL);

    useEffect(() => {
        sentenceIdRef.current = currentSentenceID;
    }, [currentSentenceID]);
    useEffect(() => {
        playStateRef.current = playButtonState;
    }, [playButtonState]);
    useEffect(() => {
        readSpeedRef.current = readingSpeed;
    }, [readingSpeed]);

    useEffect(() => {
        async function fetchServerVoices() {
            try {
                const request = await fetch("http://localhost:5100/api/tts/voices");
                if (!request.ok) throw new Error("Failed to load voices");
                const data = await request.json();

                const mappedVoices: ServerVoice[] = data.map((voice: any) => ({
                    id: voice.id,
                    name: voice.name,
                    lang: voice.language,
                    quality: voice.quality
                }));

                setServerVoices(mappedVoices);
                if (mappedVoices.length > 0) {
                    setCurrentServerVoice(mappedVoices[0]);
                    if (selectedEngine === SpeechEngine.SERVER) {
                        voiceRef.current = mappedVoices[0];
                    }
                }
            } catch (error) {
                console.error("Error populating server voice engine:", error);
            }
        }
        fetchServerVoices();
    }, []);

    useEffect(() => {
        const initLocalVoices = () => {
            const loadedVoices = speechSynthesis.getVoices();
            setLocalVoices(loadedVoices);
            if (loadedVoices.length > 0) {
                setCurrentLocalVoice(prev => {
                    const newVoice = prev ? prev : loadedVoices[0];
                    if (selectedEngine === SpeechEngine.LOCAL) {
                        voiceRef.current = newVoice;
                    }
                    return newVoice;
                });
            }
        };

        initLocalVoices();
        speechSynthesis.addEventListener("voiceschanged", initLocalVoices);
        return () => speechSynthesis.removeEventListener("voiceschanged", initLocalVoices);
    }, [selectedEngine]);

    useEffect(() => {
        localStorage.setItem('appBackground', theme.appBackground);
        localStorage.setItem('floatingBarBackground', theme.floatingBarBackground);
        localStorage.setItem('canvasColor1', theme.canvasColor1);
        localStorage.setItem('canvasColor2', theme.canvasColor2);
    }, [theme]);

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

        if (engine === SpeechEngine.LOCAL && currentLocalVoice) {
            voiceRef.current = currentLocalVoice;
        } else if (engine === SpeechEngine.SERVER && currentServerVoice) {
            voiceRef.current = currentServerVoice;
        }

        if (playButtonState){
            handlePlayback(currentSentenceID)
        }
    }

    function handleSegmentation(): SentenceItem[] {
        if (!canvasRef.current) return [];

        let sentenceIdCounter = 0;
        const text = canvasRef.current.textContent ?? "";
        const segmentationLocale = tts.getCurrentLanguage() === "all" ? "en" : tts.getCurrentLanguage();
        const segmenter = new Intl.Segmenter(segmentationLocale, { granularity: "sentence" })
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

    function handleLanguageChange(locale: string) {
        tts.setCurrentLanguage(locale);
        const normalCode = locale.split('-')[0];

        if (selectedEngine === SpeechEngine.LOCAL) {
            const matching = localVoices.filter(v => v.lang.startsWith(normalCode));
            if (matching.length > 0) {
                setCurrentLocalVoice(matching[0]);
                voiceRef.current = matching[0];
            }
        } else {
            const matching = serverVoices.filter(v => v.lang.startsWith(normalCode));
            if (matching.length > 0) {
                setCurrentServerVoice(matching[0]);
                voiceRef.current = matching[0];
            }
        }
        setTextChanged(true);
    }

    const themeMenu: MenuItem[] = [
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
    ];

    const speedMenu: MenuItem[] = [
        {
            label: "0.5x", action: () => {
                setReadingSpeed(ReadingSpeed.SLOWEST);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.SLOWEST
        },
        {
            label: "0.75x", action: () => {
                setReadingSpeed(ReadingSpeed.SLOW);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.SLOW
        },
        {
            label: "1x", action: () => {
                setReadingSpeed(ReadingSpeed.NORMAL);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.NORMAL
        },
        {
            label: "1.25x", action: () => {
                setReadingSpeed(ReadingSpeed.FAST);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.FAST
        },
        {
            label: "1.5x", action: () => {
                setReadingSpeed(ReadingSpeed.FASTER);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.FASTER
        },
        {
            label: "2x", action: () => {
                setReadingSpeed(ReadingSpeed.FASTEST);
                closeMenu();
                handlePlayback(sentenceIdRef.current);
            }, selected: readingSpeed === ReadingSpeed.FASTEST
        }
    ];

    const engineMenu: MenuItem[] = [
        {
            label: "Native",
            action: () => {
                handleEngineChange(SpeechEngine.LOCAL);
                closeMenu();
            },
            selected: selectedEngine === SpeechEngine.LOCAL
        },
        {
            label: "Cloud",
            action: () => {
                handleEngineChange(SpeechEngine.SERVER);
                closeMenu();
            },
            selected: selectedEngine === SpeechEngine.SERVER
        }
    ];

    const languageMenu: MenuItem[] = [
        { label: "All", action: () => handleLanguageChange("all"), selected: tts.getCurrentLanguage() === 'all' },
        { label: "English", action: () => handleLanguageChange("en"), selected: tts.getCurrentLanguage() === 'en' },
        { label: "French", action: () => handleLanguageChange("fr"), selected: tts.getCurrentLanguage() === 'fr' },
        { label: "Spanish", action: () => handleLanguageChange("es"), selected: tts.getCurrentLanguage() === 'es' },
        { label: "Greek", action: () => handleLanguageChange("el"), selected: tts.getCurrentLanguage() === 'el' }
    ];

    const getActiveVoicesMenu = (): MenuItem[] => {
        if (selectedEngine === SpeechEngine.LOCAL) {
            return localVoices.map((voice: SpeechSynthesisVoice): MenuItem => ({
                label: voice.name,
                action: () => {
                    setCurrentLocalVoice(voice);
                    voiceRef.current = voice;
                    closeMenu();
                    if (sentenceIdRef.current !== "-1") {
                        handlePlayback(sentenceIdRef.current);
                    }
                },
                selected: currentLocalVoice ? currentLocalVoice.name === voice.name : false
            }));
        } else {
            return serverVoices.filter(x=>x.lang==tts.getCurrentLanguage()).map((voice: ServerVoice): MenuItem => ({
                label: `${voice.name} (${voice.quality})`,
                action: () => {
                    setCurrentServerVoice(voice);
                    voiceRef.current = voice;
                    closeMenu();
                    if (sentenceIdRef.current !== "-1") {
                        handlePlayback(sentenceIdRef.current);
                    }
                },
                selected: currentServerVoice ? currentServerVoice.id === voice.id : false
            }));
        }
    };

    const settingsMenu: MenuItem[] = [
        { label: "App Theme", icon: "colorpicker", action: () => setMenuViewStack(prev => [...prev, "theme"]) },
        { label: "Upload File", icon: "upload", action: () => console.log("upload") },
        { label: "Reading Speed", icon: "speed", action: () => setMenuViewStack(prev => [...prev, "speed"]) },
        { label: "Voices", action: () => setMenuViewStack(prev => [...prev, "voices"]) },
        { label: "Languages", action: () => setMenuViewStack(prev => [...prev, "languages"]) },
        { label: "Speech Engine", action: () => setMenuViewStack(prev => [...prev, "engine"]) },
        {
            label: showWordBar ? "Hide WordBar" : "Show WordBar",
            action: () => {
                setShowWordBar(!showWordBar);
                closeMenu();
            },
        }
    ];

    const getActiveMenuItems = (): MenuItem[] => {
        const currentView = menuViewStack.at(-1);
        switch (currentView) {
            case "theme": return themeMenu;
            case "speed": return speedMenu;
            case "engine": return engineMenu;
            case "languages": return languageMenu;
            case "voices": return getActiveVoicesMenu();
            default: return settingsMenu;
        }
    };

    const themeVars = {
        "--app-background": theme.appBackground,
        "--floating-bar-background": `${theme.floatingBarBackground}92`,
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
        setMenuViewStack(["main"]);
        setPanelState("settings");
    }

    function closeMenu() {
        setPanelState("closed");
        setTimeout(() => {
            setMenuViewStack([]);
        }, 500);
    }

    function handleMenuItemClick(item: ActionMenuItem) {
        item.action?.();
    }

    function handleForwardBackward(value: string) {
        let targetIdNumber = value === "f"
            ? Number(currentSentenceID) + 1
            : Number(currentSentenceID) - 1;

        if (targetIdNumber < 0) targetIdNumber = 0;

        handlePlayback(targetIdNumber.toString());
    }

    function handleBack() {
        if (menuViewStack.length === 1) {
            closeMenu();
            return;
        }
        setMenuViewStack(prev => prev.slice(0, -1));
    }

    return (
        <div className="appShell" style={themeVars}>
            <ReadingCanvas
                currentWord={currentWord}
                barShown={showWordBar}
                currentSentenceID={currentSentenceID.toString()}
                onClick={(id: number) => { handlePlayback(id.toString()) }}
                sentences={sentences}
                isPlaying={playButtonState}
                canvasRef={canvasRef}
                onInput={() => setTextChanged(true)}
            />
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
                        items={getActiveMenuItems()}
                        onItemClick={handleMenuItemClick}
                        onBack={handleBack}
                        canGoBack={menuViewStack.length > 1}
                    />
                }
                user={
                    <UserMenuItems onBack={closeMenu}/>
                }
            />
        </div>
    );
}