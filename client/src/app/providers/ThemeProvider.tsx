import React, { createContext, useContext, useEffect, useState } from 'react'
type ThemeOptions = 'light' | 'dark'
interface ITheme {
    theme: ThemeOptions,
    toogleTheme: ()=>void
}
const ThemeContext = createContext<ITheme>({ theme: 'dark', toogleTheme:()=>{} })

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [theme, setTheme] = useState<ThemeOptions>(() => {
        const theme = localStorage.getItem('theme')
        return theme === 'dark' ? 'dark' : 'light'
    })

    useEffect(() => {
        const root = document.body
        if (theme === 'dark') {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [theme])

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved) {
            setTheme((prev) => {
                if (prev !== saved) {
                    return saved === 'dark' ? 'dark' : 'light'
                }
                return prev
            })
        }
    }, [])


    const toogleTheme = ()=>{
        setTheme(prev=> prev === "dark" ? "light" : "dark")
    }

    return (
        <ThemeContext.Provider value={{ theme, toogleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider



export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used inside ThemeProvider')
    return context
}
