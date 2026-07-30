import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    icon?: ReactNode
}




const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover',
    secondary: 'bg-surface text-heading border border-border hover:bg-hover',
    danger: 'bg-danger text-white border border-red-500 hover:bg-red-600',
    ghost: 'text-muted hover:bg-hover',
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
