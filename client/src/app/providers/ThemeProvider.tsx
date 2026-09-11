import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'theme'

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
    return theme === 'system' ? getSystemTheme() : theme
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system')

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
        'light'
    )

    useEffect(() => {
        const savedTheme = sessionStorage.getItem(STORAGE_KEY)

        const initialTheme: Theme =
            savedTheme === 'light' ||
            savedTheme === 'dark' ||
            savedTheme === 'system'
                ? savedTheme
                : 'system'

        setThemeState(initialTheme)
        setResolvedTheme(resolveTheme(initialTheme))
    }, [])

    useEffect(() => {
        const root = document.documentElement

        const applyTheme = () => {
            const resolved = resolveTheme(theme)

            root.classList.toggle('dark', resolved === 'dark')
            setResolvedTheme(resolved)
        }

        applyTheme()

        if (theme !== 'system') {
            return
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        mediaQuery.addEventListener('change', applyTheme)

        return () => {
            mediaQuery.removeEventListener('change', applyTheme)
        }
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        sessionStorage.setItem(STORAGE_KEY, newTheme)
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }

    return context
}
