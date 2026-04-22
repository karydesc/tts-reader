// import type {AuthState} from "../Types.ts";
import styles from "../styles/FloatingControlBar.module.css"
import ListItem from "./ListItem.tsx";

type Props = {
    // authState: AuthState
    onBack: () => void

}
export default function UserMenuItems({onBack}: Props) {
    return (
        <div className={styles.userMenuContainer}>
            <div className={styles.userMenuHeader}>
                <h2>Christos Karydis</h2>
            </div>
            <div className={styles.userMenuContainer}>
                <h4>example1</h4>
                <h4>example2</h4>
                <h4>example3</h4>
            </div>
            <div className={styles.userButtonsContainer}>
                <ListItem text="Return" rightIcon="rightChevron" onClick={onBack}></ListItem>
                <ListItem text="Sign out" rightIcon="rightChevron" onClick={() => {
                }}/>
            </div>

        </div>
    )

}
