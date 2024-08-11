import { createContext, useContext, useState } from "react";
import { orangeBerry } from "../constant/colorTheme";

const ThemeContext = createContext()

const themes = {
    orangeBerry: orangeBerry
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('orangeBerry')

    const setColorTheme = (themeName) => {
        setTheme(themeName)
    }

    const getSideBarTheme = () => {
        const CurrentTheme = themes[theme]
        if(CurrentTheme?.gradient) {
            return `bg-gradient-to-t from-[${CurrentTheme.primeColor}] to-[${CurrentTheme.secondColor}]`
        }
        return ''
    }

    return (
        <ThemeContext.Provider value={{ theme: themes[theme], setColorTheme, getSideBarTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);
