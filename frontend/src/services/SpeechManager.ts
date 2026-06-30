export const SpeechEngine = {
    NATIVE: 0,
    PIPER: 1
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

    constructor(defaultEngine: SpeechEngine = SpeechEngine.NATIVE) {
        this.currentEngine = defaultEngine;
    }

    public setEngine(engine: SpeechEngine): void {
        this.cancel();
        this.currentEngine = engine;
    }

    public getEngine(): SpeechEngine {
        return this.currentEngine;
    }

    public speak(
        text: string,
        voice: any,
        rate: ReadingSpeed,
        onBoundary: (charIndex: number, charLength: number) => void,
        onEnd: () => void
    ): void {
        this.cancel();

        switch (this.currentEngine) {
            case SpeechEngine.NATIVE: {
                const utterance = new SpeechSynthesisUtterance(text);
                this.activeUtterance = utterance;
                utterance.rate = rate;

                if (voice && voice instanceof SpeechSynthesisVoice) {
                    utterance.voice = voice;
                }

                utterance.onboundary = (e) => {
                    onBoundary(e.charIndex, e.charLength || 0);
                };

                utterance.onend = onEnd;
                speechSynthesis.speak(utterance);
                break;
            }
            case SpeechEngine.PIPER:
                console.warn(`SpeechEngine.PIPER: ${voice}`);
        }


    }

    public pause(): void {
        this.paused = true;
        switch (this.currentEngine) {
            case SpeechEngine.NATIVE:
                speechSynthesis.pause();
                break;
            case SpeechEngine.PIPER:
                console.log("SpeechEngine.PIPER paused!");
                break;
        }
    }

    public resume(): void {
        this.paused = false;
        switch (this.currentEngine) {
            case SpeechEngine.NATIVE:
                speechSynthesis.resume();
                break;
            case SpeechEngine.PIPER:
                console.log("SpeechEngine.PIPER resumed!");
                break;
        }
    }

    public cancel(): void {
        if (this.activeUtterance) {
            this.activeUtterance.onend = null;
        }

        switch (this.currentEngine) {
            case SpeechEngine.NATIVE:
                speechSynthesis.cancel();
                break;
            case SpeechEngine.PIPER:
                console.log("SpeechEngine.PIPER cancelled!");
                break;
        }
    }

    public isPaused(): boolean {
        return this.paused;
    }

    public getVoices(): any {
        switch (this.currentEngine) {
            case SpeechEngine.NATIVE:
                return speechSynthesis.getVoices();
            case SpeechEngine.PIPER:
                break;
        }
    }

}