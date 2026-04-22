import IconButton from "./IconButton";

type Props = {
    handleTogglePlay: () => void;
    onOpenUserMenu: () => void;
    onOpenSettingsMenu: () => void;
    isPlaying: boolean;
}

export default function BarItems({onOpenUserMenu, onOpenSettingsMenu, handleTogglePlay, isPlaying}: Props) {
    return (<>
        <IconButton icon="rewind"/>
        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay}/>
        <IconButton icon="forward"/>
        <div style={{flexGrow: 1}}/>
        <IconButton icon="more" onClick={onOpenSettingsMenu}/>
        <IconButton icon="user" onClick={onOpenUserMenu}/>

    </>)
}
