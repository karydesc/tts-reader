import styles from "../styles/ColorPickerMenuItem.module.css";

type ColorPickerMenuItemProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export default function ColorPickerMenuItem({label, value, onChange}: ColorPickerMenuItemProps) {
    return (
        <label className={styles.row}>
            <span>{label}</span>
            <input
                className={styles.input}
                type="color"

                value={value}
                style={{opacity: '0'}}
                onChange={(event) => onChange(event.target.value)}
                aria-label={label}
            />
        </label>
    );
}
