import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

const ThemeTrigger = () => {
    const [dark, setDark] = useState(false)

    // Apply theme to <html>
    useEffect(() => {
        const root = document.documentElement

        if (dark) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [dark])

    // Load saved theme
    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark') {
            setDark(true)
        }
    }, [])

    return (
        <Button
            type="button"
            variant="secondary"
            onClick={() => setDark((d) => !d)}
            // className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:bg-hover"
            aria-label="Toggle dark mode"
        >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    )
}

export default ThemeTrigger
