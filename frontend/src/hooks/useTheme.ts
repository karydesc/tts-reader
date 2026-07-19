import {type CSSProperties, useEffect, useState} from "react";

type ThemeState = {
    appBackground: string;
    floatingBarBackground: string;
    canvasColor1: string;
    canvasColor2: string;
};

const defaultTheme: ThemeState = {
    appBackground: "#a6d4ff",
    floatingBarBackground: "#0b102f",
    canvasColor1: "#091f55",
    canvasColor2: "#357cc7",
};


export function useTheme() {
    const [theme, setTheme] = useState<ThemeState>({
        appBackground: localStorage.getItem('appBackground') ?? "#a6d4ff",
        floatingBarBackground: localStorage.getItem('floatingBarBackground') ?? "#0b102f",
        canvasColor1: localStorage.getItem('canvasColor1') ?? "#091f55",
        canvasColor2: localStorage.getItem('canvasColor2') ?? "#357cc7",
    });

    useEffect(() => {
        localStorage.setItem('appBackground', theme.appBackground);
        localStorage.setItem('floatingBarBackground', theme.floatingBarBackground);
        localStorage.setItem('canvasColor1', theme.canvasColor1);
        localStorage.setItem('canvasColor2', theme.canvasColor2);
    }, [theme]);

    function updateThemeColor(key: keyof ThemeState) {
        return (value: string) => {
            setTheme((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        };
    }

    function resetThemeColor() {
        setTheme(defaultTheme)
    }


    const themeVars = {
        "--app-background": theme.appBackground,
        "--floating-bar-background": `${theme.floatingBarBackground}92`,
        "--canvasColor1": theme.canvasColor1,
        "--canvasColor2": theme.canvasColor2,
    } as CSSProperties;

    return { themeVars, theme, updateThemeColor, resetThemeColor };



}