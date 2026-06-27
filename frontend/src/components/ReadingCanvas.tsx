import styles from '../styles/ReadingCanvas.module.css'
import Sentence from "./Sentence.tsx";
import type {SentenceItem} from "../Types.ts";
import * as React from "react";

type Prop = {
    isPlaying: boolean,
    onClick: (id: number) => void,
    canvasRef: React.Ref<HTMLDivElement>,
    sentences: SentenceItem[],
    currentSentenceID: string,
    barShown: boolean,
    currentWord: string,
}

export default function ReadingCanvas({isPlaying, canvasRef, sentences, currentSentenceID, onClick, barShown, currentWord}: Prop) {
    return (

        <div style={{ width: '100%', display: 'flex',flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className={`${styles.wordBar} ${barShown? styles.shown : styles.hidden}`} contentEditable={false}> {currentWord} </div>

            {isPlaying && (
                <div className={`${styles.canvas} ${barShown? styles.shown : styles.hidden}`}>
                    {sentences.map((sentence) => {
                        if (sentence.isNewline) {
                            return <br key={sentence.key} />
                        } else {
                            return (
                                <Sentence
                                    key={sentence.key}
                                    text={sentence.text}
                                    id={sentence.id}
                                    onClick={() => {onClick(parseInt(sentence.id))}}
                                    isHighlighted={currentSentenceID === sentence.id}
                                />
                            )
                        }
                    })}
                </div>
            )}

            <div
                ref={canvasRef}
                className={`${styles.canvas} ${barShown? styles.shown : styles.hidden}`}
                contentEditable="plaintext-only"
                style={{ display: isPlaying ? 'none' : 'block' }}
            />

        </div>
    )
}