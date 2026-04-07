import IconButton from "./IconButton";

type Props = {
    handleToggleMoreMenu: () => void;
    handleToggleUserMenu?: () => void;
    handleTogglePlay: () => void;
    isPlaying: boolean;
}

export default function BarItems({handleToggleMoreMenu, handleToggleUserMenu, handleTogglePlay, isPlaying}: Props) {
    return (<>
        <IconButton icon="rewind" />
        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay} />
        <IconButton icon="forward" />
        <div style={{ flexGrow: 1 }}/>
        <IconButton icon="more" onClick={handleToggleMoreMenu} />
        <IconButton icon="user" onClick={handleToggleUserMenu}/>

    </>)
}
