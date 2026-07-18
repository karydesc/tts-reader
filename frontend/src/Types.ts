import type {IconName} from "./assets/Icons.tsx";

type BaseMenuItem = {
    label: string;
    icon?: IconName;
    selected?: boolean;
};

export type ActionMenuItem = BaseMenuItem & {
    kind?: "action";
    action?: () => void;
    submenu?: MenuItem[];
};

export type ColorPickerMenuItem = BaseMenuItem & {
    kind: "colorPicker";
    value: string;
    onChange: (value: string) => void;
};

export type MenuItem = ActionMenuItem | ColorPickerMenuItem;

export type UserView =
    | "signIn"
    | "signUp"
    | "forgotPassword"
    | "accountHome"


export type PanelState = "closed" | "settings" | "user"

export type SentenceItem =
    {isNewline: boolean; text: string; id: string; key: string}


export type ServerVoice = {
    name: string;
    id: number;
    lang: string;
    quality: "low" | "medium" | "high";
}