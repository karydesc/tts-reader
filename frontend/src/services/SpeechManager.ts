import type {ServerVoice} from "../Types.ts";

export const SpeechEngine = {
    LOCAL: 0,
    SERVER: 1
} as const;
export type SpeechEngine = typeof SpeechEngine[keyof typeof SpeechEngine];

export const ReadingSpeed = {
    SLOWEST: 0.5,
    SLOW: 0.75,
    NORMAL: 1,
    FAST: 1.25,
    FASTER: 1.5,
    FASTEST: 2
} as const;

export type ReadingSpeed = typeof ReadingSpeed[keyof typeof ReadingSpeed];

export class SpeechManager {
    private currentEngine: SpeechEngine;
    private activeUtterance: SpeechSynthesisUtterance | null = null;
    private paused: boolean = false;
    private activeAudioElement: HTMLAudioElement | undefined;
    private currentLanguage: string = "en";

    private currentPlayId: number = 0;
    private currentFetchController?: AbortController;

    constructor(defaultEngine: SpeechEngine = SpeechEngine.LOCAL) {
        this.currentEngine = defaultEngine;
    }

    public setEngine(engine: SpeechEngine): void {
        this.cancel();
        this.currentEngine = engine;
    }

    public getEngine(): SpeechEngine {
        return this.currentEngine;
    }

    setCurrentLanguage(language: string): void {
        this.currentLanguage = language;
    }

    getCurrentLanguage(): string {
        return this.currentLanguage;
    }

    public async speak(
        text: string,
        voice: unknown,
        rate: ReadingSpeed,
        onBoundary: (charIndex: number, charLength: number) => void,
        onEnd: () => void
    ): Promise<void> {
        const myPlayId = ++this.currentPlayId;
        this.paused = false;

        switch (this.currentEngine) {
            case SpeechEngine.LOCAL: {
                const utterance = new SpeechSynthesisUtterance(text);
                this.activeUtterance = utterance;
                utterance.rate = rate;
                if (voice && voice instanceof SpeechSynthesisVoice) {
                    utterance.voice = voice;
                }
                utterance.onboundary = (e) => {
                    if (myPlayId === this.currentPlayId) onBoundary(e.charIndex, e.charLength || 0);
                };
                utterance.onend = () => {
                    if (myPlayId === this.currentPlayId) onEnd();
                };
                speechSynthesis.speak(utterance);
                break;
            }
            case SpeechEngine.SERVER: {
                let voiceName = "";
                if (voice && typeof voice === 'object' && 'name' in voice) {
                    voiceName = (voice as any).name;
                } else if (typeof voice === 'string') {
                    voiceName = voice;
                }

                const encodedText = encodeURIComponent(text);
                const url = `http://localhost:5100/api/tts/generate?text=${encodedText}&voice=${encodeURIComponent(voiceName)}`;

                try {
                    this.currentFetchController = new AbortController();
                    const res = await fetch(url, { signal: this.currentFetchController.signal });
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const blob = await res.blob();

                    if (myPlayId !== this.currentPlayId && !this.isPaused()) {
                        return;
                    }

                    const audioUrl = URL.createObjectURL(blob);
                    const audio = new Audio(audioUrl);
                    this.activeAudioElement = audio;
                    audio.playbackRate = rate;

                    audio.onplay = () => {
                        if (myPlayId === this.currentPlayId) onBoundary(0, text.length);
                    };
                    audio.onended = () => {
                        URL.revokeObjectURL(audioUrl);
                        if (myPlayId === this.currentPlayId) {
                            this.activeAudioElement = undefined;
                            onEnd();
                        }
                    };
                    audio.onerror = (e) => {
                        console.error("Server audio stream failed:", e);
                        URL.revokeObjectURL(audioUrl);
                        if (myPlayId === this.currentPlayId) {
                            this.activeAudioElement = undefined;
                            onEnd();
                        }
                    };
                    audio.play().catch((err) => {
                        console.error("Playback block cleared:", err);
                        URL.revokeObjectURL(audioUrl);
                        if (myPlayId === this.currentPlayId) onEnd();
                    });
                    this.currentFetchController = undefined;
                } catch (err) {
                    if ((err as any)?.name === 'AbortError') {
                        // handle intentional audio termination safely
                    } else {
                        console.error("Failed to fetch server audio:", err);
                    }
                    if (myPlayId === this.currentPlayId) onEnd();
                }
                break;
            }
        }
    }

    public pause(): void {
        this.paused = true;
        if (this.currentEngine === SpeechEngine.LOCAL) {
            speechSynthesis.pause();
        } else if (this.activeAudioElement) {
            this.activeAudioElement.pause();
        }
    }

    public resume(): void {
        this.paused = false;
        if (this.currentEngine === SpeechEngine.LOCAL) {
            speechSynthesis.resume();
        } else if (this.activeAudioElement) {
            this.activeAudioElement.play().catch(err => console.error(err));
        }
    }

    public cancel(): void {
        this.currentPlayId++;
        this.paused = false;

        if (this.activeUtterance) {
            this.activeUtterance.onend = null;
            this.activeUtterance = null;
        }
        speechSynthesis.cancel();

        if (this.activeAudioElement) {
            // revoke any object URL to free resources
            try {
                const src = this.activeAudioElement.src;
                if (src && src.startsWith('blob:')) {
                    URL.revokeObjectURL(src);
                }
            } catch (e) {
            }
            this.activeAudioElement.onended = null;
            this.activeAudioElement.onerror = null;
            try {
                this.activeAudioElement.pause();
                this.activeAudioElement.src = "";
                this.activeAudioElement.load();
            } catch (e) {
                // ignore
            }
            this.activeAudioElement = undefined;
        }
        if (this.currentFetchController) {
            try {
                this.currentFetchController.abort();
            } catch (e) {
                // ignore
            }
            this.currentFetchController = undefined;
        }
    }

    public isPaused(): boolean {
        return this.paused;
    }

    public getNativeVoices(): SpeechSynthesisVoice[] {
        return speechSynthesis.getVoices().filter(voice =>
            voice.localService && (this.currentLanguage === "all" || voice.lang.startsWith(this.currentLanguage.split('-')[0]))
        );
    }


    public async getServerVoices(): Promise<ServerVoice[]> {
        const request = await fetch("http://localhost:5100/api/tts/voices");
        if (!request.ok) {
            throw new Error("Something went wrong fetching voices.");
        }
        const data = await request.json();

        // map the backend keys to your frontend type layout
        return data.map((voice: any) => ({
            id: voice.id,
            name: voice.name,
            lang: voice.language, // translates "language" to "lang"
            quality: voice.quality
        }));
    }
}