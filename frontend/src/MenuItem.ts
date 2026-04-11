import type {IconName} from "./assets/Icons.tsx";

export type MenuItem = {
    label: string;
    icon?: IconName;
    action?: () => void;
    submenu?: MenuItem[];
};