import styles from "../styles/FloatingControlBar.module.css"
import gsap from "gsap"
import { useGSAP } from '@gsap/react';
import {type ReactNode, useRef} from "react"

type FloatingControlBarProps = {
    bar_children?: ReactNode
    menu_children?: ReactNode
    isMenuOpen: boolean
}
gsap.registerPlugin(useGSAP);

export default function FloatingControlBar({bar_children, menu_children, isMenuOpen}:FloatingControlBarProps) {
    const refContainer = useRef<HTMLDivElement>(null)
    useGSAP(()=>{
        if(!isMenuOpen){
            gsap.to(refContainer.current, {
                width: "50vw",
                height: "7vh",
                borderRadius: "18px",
                ease: "expo.inOut",
                duration: 0.5,

            })
        }else{
            gsap.to(refContainer.current, {
                width: "20vw",
                height: "35vh",
                borderRadius: "24px",
                duration: 0.5,
                ease: "expo.inOut",
            })
        }
    }, {dependencies: [isMenuOpen]})
    return(
        <div ref = {refContainer} className={styles.pill}>

            {/* The Bar Layer */}
            <div className={`${styles.bar} ${styles.layer} ${isMenuOpen ? styles.hidden : styles.visible}`}>
                {bar_children}
            </div>

            {/* The Menu Layer */}
            <div className={`${styles.menu} ${styles.layer} ${isMenuOpen ? styles.visible : styles.hidden}`}>
                {menu_children}
            </div>

        </div>
    )
}
