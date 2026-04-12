import {ICON_MAP, type IconName} from "../assets/Icons";
import styles from "../styles/ListItem.module.css"

type ListItemProps = {
    text: string;
    onClick?: () => void;
    leftIcon?: IconName;
    rightIcon?: IconName;
}
export default function ListItem( {text, onClick, leftIcon, rightIcon}: ListItemProps) {
    return (
        <div className={`${styles.ListItem}`} onClick={onClick}>
            {leftIcon ? ICON_MAP[leftIcon] : null}
            {text}
            <div className={styles.spacer} />
            {rightIcon ? ICON_MAP[rightIcon] : null}
        </div>
    )
}
