import styles from "../styles/FloatingControlBar.module.css"
import ListItem from "./ListItem.tsx";

type Props = {
    onBack: () => void
}

export default function UserMenuItems({onBack}: Props) {
    return (
        <div className={styles.userMenuContainer}>
            <div className={styles.userMenuHeader}>
                <div className={styles.avatar}></div>
                <div className={styles.profileDetails}>
                    <h2>Christos Karydis</h2>
                    <span className={styles.badge}>Premium Member</span>
                </div>
            </div>
            <div className={styles.statsWrapper}>
                <div className={styles.userMenuListItem}>
                    <span className={styles.statLabel}>Words Listened</span>
                    <span className={styles.statValue}>14,230</span>
                </div>
                <div className={styles.userMenuListItem}>
                    <span className={styles.statLabel}>Listening Hours</span>
                    <span className={styles.statValue}>3.5h</span>
                </div>
            </div>
            <div style={{ flexGrow: 1 }}></div>
            <div className={styles.userButtonsContainer}>
                <ListItem text="Return" rightIcon="rightChevron" onClick={onBack} />
                <ListItem text="Sign out" rightIcon="rightChevron" onClick={() => console.log("Sign Out")} />
            </div>
        </div>
    )
}