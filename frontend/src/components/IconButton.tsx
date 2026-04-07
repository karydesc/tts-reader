import styles from "../styles/IconButton.module.css";
import { ICON_MAP, type IconName } from "../assets/Icons"; 

type IconButtonProps = {
    icon: IconName; 
    classParam?: string;
    text?: string;
    onClick?: () => void;
};

export default function IconButton({ classParam = "", icon, text = "", onClick }: IconButtonProps) {
    return (
        <button 
            type="button" 
            className={`${styles.icon_button} ${classParam}`.trim()}
            onClick={onClick}
        >
            {text}
            {ICON_MAP[icon]}

        </button>
    );
}
