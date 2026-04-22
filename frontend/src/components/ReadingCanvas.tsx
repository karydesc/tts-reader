import styles from '../styles/ReadingCanvas.module.css'

type Prop = {
    isPlaying: boolean,
    canvasRef: React.Ref<HTMLDivElement>,
}
export default function ReadingCanvas({isPlaying, canvasRef}: Prop) {

    return (
        <div ref={canvasRef}
             className={styles.canvas} contentEditable={isPlaying ? "false" : "plaintext-only"}>
        </div>
    )
}