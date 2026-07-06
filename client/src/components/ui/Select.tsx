import { ChevronDown } from "lucide-react"
import { controlBase, controlBorder, Field, type BaseFieldProps } from "./Field"
import { useId, type SelectHTMLAttributes } from "react"

export interface SelectOption {
    value: string
    label: string
}

export interface SelectProps
    extends
        BaseFieldProps,
        Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'> {
    options?: SelectOption[]
    placeholder?: string
}

export function Select({
    label,
    hint,
    error,
    required,
    options = [],
    placeholder,
    className = '',
    id,
    ...props
}: SelectProps) {
    const autoId = useId()
    const inputId = id || autoId
    return (
        <Field
            id={inputId}
            label={label}
            hint={hint}
            error={error}
            required={required}
        >
            <div className="relative">
                <select
                    id={inputId}
                    aria-invalid={!!error}
                    defaultValue=""
                    className={`${controlBase} ${controlBorder(
                        error
                    )} h-10 appearance-none pl-3 pr-9 ${className}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            </div>
        </Field>
    )
}
