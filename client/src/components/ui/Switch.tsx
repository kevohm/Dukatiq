import { useId, type InputHTMLAttributes, type ReactNode } from "react"

export interface SwitchProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'type' | 'onChange' | 'checked'
> {
    label?: ReactNode
    hint?: string
    checked?: boolean
    onChange?: (checked: boolean) => void
    id?: string
    disabled?: boolean
}

export function Switch({
    label,
    hint,
    checked,
    onChange,
    id,
    disabled,
    ...props
}: SwitchProps) {
    const autoId = useId()
    const inputId = id || autoId
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={inputId}
                className={`flex items-center justify-between gap-3 ${
                    disabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                }`}
            >
                {label && (
                    <span className="text-sm text-heading">
                        {label}
                    </span>
                )}
                <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                    <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) => onChange?.(e.target.checked)}
                        className="peer sr-only"
                        {...props}
                    />
                    <span
                        className="absolute inset-0 rounded-full bg-border transition-colors duration-200 peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/25"
                        aria-hidden="true"
                    />
                    <span
                        className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5"
                        aria-hidden="true"
                    />
                </span>
            </label>
            {hint && (
                <p className="text-xs text-muted">{hint}</p>
            )}
        </div>
    )
}
