import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/Button'
import { useTheme } from '@/app/providers/ThemeProvider'

const ThemeTrigger = () => {
    const { resolvedTheme, toggleTheme } = useTheme()

    const isDark = resolvedTheme === 'dark'

    return (
        <Button
            type="button"
            variant="secondary"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    )
}

export default ThemeTrigger
