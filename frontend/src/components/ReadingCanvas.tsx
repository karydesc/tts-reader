import styles from '../styles/ReadingCanvas.module.css'
import Sentence from "./Sentence.tsx";
import type {SentenceItem} from "../Types.ts";

type Prop = {
    isPlaying: boolean,
    canvasRef: React.Ref<HTMLDivElement>,
    sentences: SentenceItem[],
    currentSentenceID: string,
}

export default function ReadingCanvas({isPlaying, canvasRef, sentences, currentSentenceID}: Prop) {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

            {isPlaying && (
                <div className={styles.canvas}>
                    {sentences.map((sentence) => {
                        if (sentence.isNewline) {
                            return <br key={sentence.key} />
                        } else {
                            return (
                                <Sentence
                                    key={sentence.key}
                                    text={sentence.text}
                                    id={sentence.id}
                                    isHighlighted={currentSentenceID === sentence.id}
                                />
                            )
                        }
                    })}
                </div>
            )}

            <div
                ref={canvasRef}
                className={styles.canvas}
                contentEditable="plaintext-only"
                style={{ display: isPlaying ? 'none' : 'block' }}
            />

        </div>
    )
}