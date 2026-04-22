import styles from "../styles/FloatingControlBar.module.css"
import gsap from "gsap"
import {useGSAP} from '@gsap/react';
import {type ReactNode, useRef} from "react"
import type {PanelState} from "../Types.ts";


type Props = {
    bar: ReactNode
    menu: ReactNode
    user: ReactNode
    panelState: PanelState
}
gsap.registerPlugin(useGSAP);
export default function FloatingControlBar({bar, menu, user, panelState}: Props) {
    const refContainer = useRef<HTMLDivElement>(null)
    useGSAP(() => {
        if (!refContainer.current) return;
        switch (panelState) {
            case "closed":
                gsap.to(refContainer.current, {
                    width: "40vw",
                    height: "7vh",
                    borderRadius: "60px",
                    padding: "8px 10px",
                    ease: "expo.inOut",
                    duration: 0.5,
                })
                break;
            case "settings":
                gsap.to(refContainer.current, {
                    width: "20vw",
                    height: "50vh",
                    borderRadius: "18px",
                    padding: "8px 10px",
                    duration: 0.5,
                    ease: "expo.inOut",
                })
                break;
            case "user":
                gsap.to(refContainer.current, {
                    width: "25vw",
                    height: "50vh",
                    padding: 0,
                    borderRadius: "18px",
                    duration: 0.5,
                    ease: "expo.inOut",
                })
        }
    }, {dependencies: [panelState]})

    return (
        <div ref={refContainer} className={styles.pill}>

            <div className={`${styles.bar} ${styles.layer} ${panelState == "closed" ? styles.visible : styles.hidden}`}>
                {bar}
            </div>

            <div
                className={`${styles.menu} ${styles.layer} ${panelState == "settings" ? styles.visible : styles.hidden}`}>
                {menu}
            </div>

            <div
                className={`${styles.userMenu} ${styles.layer} ${panelState == "user" ? styles.visible : styles.hidden}`}>
                {user}
            </div>


        </div>
    )
}
