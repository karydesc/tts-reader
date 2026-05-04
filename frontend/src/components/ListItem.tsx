import {ICON_MAP, type IconName} from "../assets/Icons";
import styles from "../styles/ListItem.module.css"

type ListItemProps = {
    text: string;
    onClick?: () => void;
    leftIcon?: IconName;
    rightIcon?: IconName;
    selected?: boolean;
}
export default function ListItem({text, onClick, leftIcon, rightIcon, selected}: ListItemProps) {
    return (
        <div className={`${styles.ListItem} ${selected ? styles.highlighted : ""}`} onClick={onClick}>
            {leftIcon ? ICON_MAP[leftIcon] : null}
            {text}
            <div className={styles.spacer}/>
            {rightIcon ? ICON_MAP[rightIcon] : null}
        </div>
    )
}
