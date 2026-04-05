import styles from '../styles/ReadingCanvas.module.css'


export default function ReadingCanvas(){
    return (
        <div className={styles.canvas} contentEditable="true"></div>
    )
}