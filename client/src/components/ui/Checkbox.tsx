import { Check } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface CheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'className' | 'type'
> {
    label: ReactNode
    hint?: string
    id?: string
    className?: string
}

export function Checkbox({
    label,
    hint,
    id,
    className = '',
    ...props
}: CheckboxProps) {
    const autoId = useId()
    const inputId = id || autoId
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={inputId}
                className="flex items-center gap-2.5 cursor-pointer select-none"
            >
                <span className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                    <input
                        id={inputId}
                        type="checkbox"
                        className={`peer h-[18px] w-[18px] shrink-0 appearance-none rounded-md border border-border dark:border-slate-900 bg-surface dark:bg-slate-950 transition-colors duration-150 checked:border-brand checked:bg-brand focus-visible:ring-2 focus-visible:ring-brand/25 ${className}`}
                        {...props}
                    />
                    <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                </span>
                <span className="text-sm text-heading">{label}</span>
            </label>
            {hint && <p className="pl-[26px] text-xs text-muted dark:text-slate-500">{hint}</p>}
        </div>
    )
}
