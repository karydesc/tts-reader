import {ICON_MAP, type IconName} from "../assets/Icons";
import styles from "../styles/ListItem.module.css"

type ListItemProps = {
    text: string;
    onClick?: () => void;
    hasEndChevron?: boolean;
    rightIcon?: IconName;
}
export default function ListItem( {text, onClick, rightIcon}: ListItemProps) {
    return (
        <div className={`${styles.ListItem}`} onClick={onClick}>
            {text}
            <div className={styles.spacer} />
            {rightIcon ? ICON_MAP[rightIcon] : null}
        </div>
    )
}
