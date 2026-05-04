import IconButton from "./IconButton";

type Props = {
    handleTogglePlay: () => void;
    onOpenUserMenu: () => void;
    onOpenSettingsMenu: () => void;
    handleForwardBackward: (arg0: string) => void;
    isPlaying: boolean;
}

export default function BarItems({onOpenUserMenu, onOpenSettingsMenu, handleTogglePlay, isPlaying, handleForwardBackward}: Props) {
    return (<>
        <IconButton icon="rewind" onClick={()=>{handleForwardBackward("r")}}/>
        <IconButton icon={isPlaying ? "pause" : "play"} onClick={handleTogglePlay}/>
        <IconButton icon="forward" onClick={()=>{handleForwardBackward("f")}}/>
        <div style={{flexGrow: 1}}/>
        <IconButton icon="more" onClick={onOpenSettingsMenu}/>
        <IconButton icon="user" onClick={onOpenUserMenu}/>

    </>)
}
