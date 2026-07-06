import {
    useId,
    useState,
    type InputHTMLAttributes,
    type ReactNode,
    type SelectHTMLAttributes,
    type TextareaHTMLAttributes,
} from 'react'
import {
    Search,
    X,
    Eye,
    EyeOff,
    ChevronDown,
    Check,
    AlertCircle,
    Moon,
    Sun,
    type LucideIcon,
} from 'lucide-react'

/* -------------------------------------------------------------------------
   Shared bits
------------------------------------------------------------------------- */

interface FieldProps {
    id: string
    label?: string
    hint?: string
    error?: string
    required?: boolean
    children: ReactNode
}

// Wraps any control with a label + optional helper/error text.
// Every field below is built on top of this so spacing and copy stay consistent.
export function Field({
    id,
    label,
    hint,
    error,
    required,
    children,
}: FieldProps) {
    const hintId = hint || error ? `${id}-hint` : undefined
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-[var(--color-heading)]"
                >
                    {label}
                    {required && (
                        <span className="text-[var(--color-priority-high-text)]">
                            {' '}
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {(hint || error) && (
                <p
                    id={hintId}
                    className={
                        error
                            ? 'flex items-center gap-1 text-xs text-[var(--color-priority-high-text)]'
                            : 'text-xs text-[var(--color-muted)]'
                    }
                >
                    {error && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                    {error || hint}
                </p>
            )}
        </div>
    )
}


// Base classes shared by every "box" style control (text input, search, select, textarea).
export const controlBase =
    'w-full rounded-lg border bg-[var(--color-surface)] text-sm text-[var(--color-heading)] ' +
    'placeholder:text-[var(--color-muted)] outline-none transition-colors duration-150 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-hover)]'

export const controlBorder = (error?: string | boolean) =>
    error
        ? 'border-[var(--color-priority-high-text)]/40 focus:border-[var(--color-priority-high-text)] focus:ring-2 focus:ring-[var(--color-priority-high-text)]/15'
        : 'border-[var(--color-border)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/15'

// Fields shared by every labeled control (Field's props, minus the ones each
// component supplies itself: id and children).
export interface BaseFieldProps {
    label?: string
    hint?: string
    error?: string
    required?: boolean
    className?: string
    id?: string
}
