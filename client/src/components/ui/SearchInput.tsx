import { useId, type InputHTMLAttributes } from "react"
import { controlBase, controlBorder, Field, type BaseFieldProps } from "./Field"
import { Search, X } from "lucide-react"

export interface SearchInputProps
    extends
        Pick<BaseFieldProps, 'label' | 'hint' | 'className' | 'id'>,
        Omit<
            InputHTMLAttributes<HTMLInputElement>,
            'id' | 'className' | 'type' | 'onChange'
        > {
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClear?: () => void
}


export function SearchInput({
    label,
    hint,
    placeholder = 'Search',
    value,
    onChange,
    onClear,
    className = '',
    id,
    ...props
}: SearchInputProps) {
    const autoId = useId()
    const inputId = id || autoId
    const hasValue = Boolean(value)

    return (
        <Field id={inputId} label={label} hint={hint}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                    id={inputId}
                    type="search"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${controlBase} ${controlBorder(false)} h-10 pl-9 ${
                        hasValue ? 'pr-9' : 'pr-3'
                    } [&::-webkit-search-cancel-button]:appearance-none ${className}`}
                    {...props}
                />
                {hasValue && onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </Field>
    )
}
