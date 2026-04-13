import styles from "../styles/IconButton.module.css";
import { ICON_MAP, type IconName } from "../assets/Icons"; 

type IconButtonProps = {
    icon?: IconName;
    classParam?: string;
    image?: string;
    onClick?: () => void;
};

export default function IconButton({ classParam = "", icon, onClick, image }: IconButtonProps) {
    return (
        <button 
            type="button" 
            className={`${styles.icon_button} ${classParam}`.trim()}
            onClick={onClick}
        >
            {image ? (<img style={{width:"10px", height:"10px" }} src={image} alt=""/>) : ICON_MAP[icon!]}

        </button>
    );
}
