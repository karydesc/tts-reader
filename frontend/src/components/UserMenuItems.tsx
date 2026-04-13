// import type {AuthState} from "../Types.ts";
import IconButton from "./IconButton.tsx"
import styles from "../styles/FloatingControlBar.module.css"
import ListItem from "./ListItem.tsx";

// type Props = {
//     // authState: AuthState
//
// }
export default function UserMenuItems(){
return (
    <div className={styles.userMenuContainer}>
        <div className={styles.userMenuHeader}>
            <IconButton image="https://images.squarespace-cdn.com/content/v1/66e7eb031de7305c5f635228/df1d3fb9-bc99-4d3f-a938-467d716870fe/Koala+sit+FT+LS+baby+-+Ann+Eldridge.jpg"/>
            <h2>Christos Karydis</h2>
        </div>
        <div className={styles.userMenuContainer}>
            <h2>example1</h2>
            <h2>example2</h2>
            <h2>example3</h2>
        </div>
        <ListItem text="Return" rightIcon="rightChevron" onClick={()=>{}}></ListItem>
        <ListItem text="Sign out" rightIcon="rightChevron" onClick={()=>{}}/>

    </div>
)

}
