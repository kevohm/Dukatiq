import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-border dark:border-slate-900 bg-surface dark:bg-slate-950',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function CardHeader({
    children,
    className,
    ...props
}: CardHeaderProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-between border-b border-border dark:border-slate-900 dark:text-slate-500 px-6 py-5',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode
}

export function CardTitle({
    children,
    className,
    ...props
}: CardTitleProps) {
    return (
        <h2
            className={cn(
                'text-lg font-semibold tracking-tight',
                className
            )}
            {...props}
        >
            {children}
        </h2>
    )
}

interface CardDescriptionProps
    extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode
}

export function CardDescription({
    children,
    className,
    ...props
}: CardDescriptionProps) {
    return (
        <p
            className={cn(
                'mt-1 text-sm text-muted dark:text-slate-500',
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function CardContent({
    children,
    className,
    ...props
}: CardContentProps) {
    return (
        <div
            className={cn('p-6', className)}
            {...props}
        >
            {children}
        </div>
    )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function CardFooter({
    children,
    className,
    ...props
}: CardFooterProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-end gap-3  border-t border-border dark:border-slate-900 px-6 py-4',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}