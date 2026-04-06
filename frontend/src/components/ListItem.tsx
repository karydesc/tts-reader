import styles from "../styles/ListItem.module.css"
type ListItemProps = {
    title: string;
    onClick?: () => void;
    hasEndArrow?: boolean;
}
export default function ListItem( {title, onClick, hasEndArrow = false}: ListItemProps) {
    return (
        <div className={styles.ListItem} onClick={onClick}>
            {title}
            <div style={{ flexGrow: 1 }}/>
            {hasEndArrow? ">" : null}
        </div>
    )
}