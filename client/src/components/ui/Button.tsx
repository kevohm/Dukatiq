import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    icon?: ReactNode
}




const variants = {
    primary: 'bg-brand  dark:bg-blue-900 text-white hover:bg-brand-hover dark:hover:bg-',
    secondary: 'bg-surface dark:bg-slate-950  text-heading dark:text-white border border-border  dark:border-slate-800 dark:hover:bg-slate-900 hover:bg-hover',
    danger: 'bg-danger text-white border border-red-500 hover:bg-red-600',
    ghost: 'text-muted dark:text-slate-500 hover:bg-hover dark:hover:bg-slate-900',
}

export function Button({
    variant = 'secondary',
    type = 'button',
    icon,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
                variants[variant],
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}
