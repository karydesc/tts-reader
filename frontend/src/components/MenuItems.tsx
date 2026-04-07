import ListItem from "./ListItem";

type Props = {
    handleToggleMoreMenu: () => void;
}

export default function MenuItems({handleToggleMoreMenu}: Props) {
    return (<>
        <ListItem rightIcon="colorpicker" text="App Theme"/>
        <ListItem rightIcon="upload" text="Upload File"/>
        <ListItem rightIcon="speed" text="Reading Speed"/>

        <div style={{ flexGrow: 1 }}/>
        <ListItem rightIcon="rightChevron" text="Return" onClick={handleToggleMoreMenu}/>
        </>
    )
}
