import { useId } from "react"

export interface RadioOption {
    value: string
    label: string
}

export interface RadioGroupProps {
    label?: string
    name: string
    options?: RadioOption[]
    value?: string
    onChange?: (value: string) => void
    hint?: string
}

export function RadioGroup({
    label,
    name,
    options = [],
    value,
    onChange,
    hint,
}: RadioGroupProps) {
    const groupId = useId()
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <span className="text-sm font-medium text-heading">
                    {label}
                </span>
            )}
            <div className="flex flex-col gap-2">
                {options.map((opt) => {
                    const optId = `${groupId}-${opt.value}`
                    return (
                        <label
                            key={opt.value}
                            htmlFor={optId}
                            className="flex items-center gap-2.5 cursor-pointer select-none"
                        >
                            <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                                <input
                                    id={optId}
                                    type="radio"
                                    name={name}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={() => onChange?.(opt.value)}
                                    className="peer h-[18px] w-[18px] shrink-0 appearance-none rounded-full border border-border bg-surface transition-colors duration-150 checked:border-[5px] checked:border-brand focus-visible:ring-2 focus-visible:ring-brand/25"
                                />
                            </span>
                            <span className="text-sm text-heading">
                                {opt.label}
                            </span>
                        </label>
                    )
                })}
            </div>
            {hint && (
                <p className="text-xs text-muted">{hint}</p>
            )}
        </div>
    )
}