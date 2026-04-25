import styles from "../styles/Sentence.module.css"
type Props = {
    text: string,
    id: string,
    isHighlighted: boolean,
    onClick?: () => void,
}

export default function Sentence({text, onClick, id, isHighlighted}: Props) {
    return (
        <span id={`sentence_${id}`} className={`${styles.sentence} ${isHighlighted ? `${styles.highlighted}` : ''}`} onClick={onClick}>
            {text}
        </span>
    )
}