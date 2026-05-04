import ListItem from "./ListItem";
import type {ActionMenuItem, MenuItem} from "../Types.ts";
import ColorPickerMenuItem from "./ColorPickerMenuItem.tsx";

type Props = {
    items: MenuItem[];
    onItemClick: (item: ActionMenuItem) => void;
    onBack: () => void;
    canGoBack: boolean;
}

export default function Menu({items, canGoBack, onBack, onItemClick}: Props) {
    return (
        <>
            {items.map((item, index) => {
                if (item.kind === "colorPicker") {
                    return (
                        <ColorPickerMenuItem
                            key={`${item.label}-${index}`}
                            label={item.label}
                            value={item.value}
                            onChange={item.onChange}
                        />
                    );
                }

                return (
                    <ListItem
                        key={`${item.label}-${index}`}
                        text={item.label}
                        leftIcon={item.icon}
                        onClick={() => onItemClick(item)}
                        selected={item.selected}
                        rightIcon={item.submenu ? "rightChevron" : undefined}
                    />
                );
            })}

            <div style={{flexGrow: 1}}></div>
            <ListItem
                text={canGoBack ? "Back" : "Return"}
                onClick={onBack}
                rightIcon="rightChevron"
            />
        </>
    );
}
