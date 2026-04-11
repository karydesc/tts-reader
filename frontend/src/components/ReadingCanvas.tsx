import styles from '../styles/ReadingCanvas.module.css'

type Prop = {
    isPlaying: boolean;
}
export default function ReadingCanvas({isPlaying}: Prop) {
    return (
        <div className={styles.canvas} contentEditable={!isPlaying}></div>
    )
}