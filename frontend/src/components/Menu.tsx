import ListItem from "./ListItem";
import type {MenuItem} from "../MenuItem.ts";
type Props = {
    items: MenuItem[];
    onItemClick: (item: MenuItem) => void;
    onBack: () => void;
    canGoBack: boolean;
}

export default function Menu({items, canGoBack, onBack, onItemClick}: Props) {
    return (<>
        {
        items.map((item: MenuItem) => (
            <ListItem key={item.label} text={item.label} rightIcon={item.icon} onClick={() => onItemClick(item)}/>
        ))
        }
        <div style={{flexGrow: 1}}></div>

            {
                canGoBack ? (<ListItem text="Back" onClick={onBack} rightIcon={"rightChevron"}/>) : <ListItem text="Return" onClick={onBack} rightIcon={"rightChevron"}/>
            }
        </>
            )
}
