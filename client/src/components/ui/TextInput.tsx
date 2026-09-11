import { useId, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { controlBase, controlBorder, Field, type BaseFieldProps } from './Field'
import { cn } from '@/lib/cn'

export interface TextInputProps
    extends BaseFieldProps,
        Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
    leadingIcon?: LucideIcon
    containerClassName?: string
}

export function TextInput({
    label,
    hint,
    error,
    required,
    type = 'text',
    leadingIcon: LeadingIcon,
    className = '',
    containerClassName = '',
    id,
    ...props
}: TextInputProps) {
    const autoId = useId()
    const inputId = id || autoId
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (show ? 'text' : 'password') : type

    return (
        <Field
            id={inputId}
            label={label}
            hint={hint}
            error={error}
            required={required}
            className={containerClassName}
        >
            <div className="relative">
                {LeadingIcon && (
                    <LeadingIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                )}
                <input
                    id={inputId}
                    type={resolvedType}
                    aria-invalid={!!error}
                    className={cn(
                        `${controlBase} ${controlBorder(error)} h-10 ${
                            LeadingIcon ? 'pl-9' : 'pl-3'
                        } ${isPassword ? 'pr-9' : 'pr-3'} `,
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                        aria-label={show ? 'Hide password' : 'Show password'}
                    >
                        {show ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
        </Field>
    )
}
