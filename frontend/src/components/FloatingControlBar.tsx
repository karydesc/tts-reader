import styles from "../styles/FloatingControlBar.module.css"
import type {ReactNode} from "react"

type FloatingControlBarProps = {
    children?: ReactNode
}
export default function FloatingControlBar({children}:FloatingControlBarProps){
    return(
        <div className={styles.container}>
            {children}
        </div>
    )
}