import styles from "../styles/FloatingControlBar.module.css"
import gsap from "gsap"
import { useGSAP } from '@gsap/react';
import {type ReactNode, useRef} from "react"


type FloatingControlBarProps = {
    isMenuOpen: boolean
    bar: ReactNode
    menu: ReactNode
}
gsap.registerPlugin(useGSAP);

export default function FloatingControlBar({isMenuOpen, bar, menu}:FloatingControlBarProps) {
    const refContainer = useRef<HTMLDivElement>(null)
    useGSAP(()=>{
        if (!refContainer.current) return;
        if(!isMenuOpen){
            gsap.to(refContainer.current, {
                width: "40vw",
                height: "7vh",
                borderRadius: "60px",
                ease: "expo.inOut",
                duration: 0.5,

            })
        }else{
            gsap.to(refContainer.current, {
                width: "20vw",
                height: "50vh",
                borderRadius: "18px",
                duration: 0.5,
                ease: "expo.inOut",
            })
        }
    }, {dependencies: [isMenuOpen]})

    return(
        <div ref = {refContainer} className={styles.pill}>

            <div className={`${styles.bar} ${styles.layer} ${isMenuOpen ? styles.hidden : styles.visible}`}>
                {bar}
            </div>

            <div className={`${styles.menu} ${styles.layer} ${isMenuOpen ? styles.visible : styles.hidden}`}>
                {menu}
            </div>



        </div>
    )
}
