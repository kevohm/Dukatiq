import { useId, type TextareaHTMLAttributes } from "react"
import { controlBase, controlBorder, Field, type BaseFieldProps } from "./Field"

export interface TextareaProps
    extends
        BaseFieldProps,
        Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> {}

export function Textarea({
    label,
    hint,
    error,
    required,
    rows = 4,
    className = '',
    id,
    ...props
}: TextareaProps) {
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
            <textarea
                id={inputId}
                rows={rows}
                aria-invalid={!!error}
                className={`${controlBase} ${controlBorder(error)} resize-y px-3 py-2 ${className}`}
                {...props}
            />
        </Field>
    )
}