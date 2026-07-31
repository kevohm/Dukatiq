import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/Button'
import { useTheme } from '@/app/providers/ThemeProvider'

const ThemeTrigger = () => {
    const { theme, toogleTheme } = useTheme()
    return (
        <Button
            type="button"
            variant="secondary"
            onClick={toogleTheme}
            // className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:bg-hover"
            aria-label="Toggle dark mode"
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    )
}

export default ThemeTrigger
