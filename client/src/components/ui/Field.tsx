import {
    type ReactNode,
} from 'react'
import {

    AlertCircle,

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
    className?:string
}

// Wraps any control with a label + optional helper/error text.
// Every field below is built on top of this so spacing and copy stay consistent.
export function Field({
    id,
    label,
    hint,
    error,
    required,
    className="",
    children,
}: FieldProps) {
    const hintId = hint || error ? `${id}-hint` : undefined
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm capitalize font-medium text-heading dark:text-slate-400"
                >
                    {label}
                    {required && <span className="text-danger"> *</span>}
                </label>
            )}
            {children}
            {(hint || error) && (
                <p
                    id={hintId}
                    className={
                        error
                            ? 'flex items-center gap-1 text-xs text-danger'
                            : 'text-xs text-muted dark:text-slate-500'
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
    'w-full rounded-lg border bg-surface dark:bg-slate-950 text-sm text-heading dark:text-slate-500 ' +
    'placeholder:text-muted outline-none transition-colors duration-150 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-hover '

export const controlBorder = (error?: string | boolean) =>
    error
        ? 'border-danger/30  focus:border-danger focus:ring-1 focus:ring-danger/10'
        : 'border-border dark:border-slate-800 focus:border-brand dark:focus:border-slate-700 focus:ring-2 dark:focus:ring-1 dark:focus-ring-slate-700 focus:ring-brand/15'

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
