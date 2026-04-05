import styles from "../styles/IconButton.module.css";
import { ICON_MAP, type IconName } from "../assets/Icons.tsx"; 

type IconButtonProps = {
    icon: IconName; 
    classParam?: string;
    label?: string;
    onClick?: () => void;
};

export default function IconButton({ classParam = "", icon, label = "", onClick }: IconButtonProps) {
    return (
        <button 
            type="button" 
            className={`${styles.icon_button} ${classParam}`.trim()}
            onClick={onClick}
        >
            {ICON_MAP[icon]} 
            
            {label}
        </button>
    );
}