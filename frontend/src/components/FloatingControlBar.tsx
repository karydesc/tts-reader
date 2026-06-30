import styles from "../styles/FloatingControlBar.module.css"
import {type ReactNode} from "react"
import type {PanelState} from "../Types.ts";

type Props = {
    bar: ReactNode
    menu: ReactNode
    user: ReactNode
    panelState: PanelState
}

export default function FloatingControlBar({bar, menu, user, panelState}: Props) {
    const getPanelClass = () => {
        switch (panelState) {
            case "settings":
                return styles.isSettings;
            case "user":
                return styles.isUser;
            default:
                return styles.isClosed;
        }
    }

    return (
        <div className={`${styles.pill} ${getPanelClass()}`}>
            <div className={`${styles.bar} ${styles.layer} ${panelState === "closed" ? styles.visible : styles.hidden}`}>
                {bar}
            </div>

            <div className={`${styles.menu} ${styles.layer} ${panelState === "settings" ? styles.visible : styles.hidden}`}>
                {menu}
            </div>

            <div className={`${styles.userMenu} ${styles.layer} ${panelState === "user" ? styles.visible : styles.hidden}`}>
                {user}
            </div>
        </div>
    )
}