import * as React from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'

import { cn } from '@/lib/cn'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@radix-ui/react-popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from 'cmdk'

import { Field, controlBase, controlBorder, type BaseFieldProps } from './Field'

export interface SelectOption {
    value: string
    label: string
}

interface SelectOrCreateProps extends BaseFieldProps {
    value?: string
    defaultValue?: string
    options: SelectOption[]
    placeholder?: string
    loading?: boolean
    loadingText?: string
    disabled?: boolean
    name: string
    className?: string

    onChange?: (value: string) => void
    onCreate?: (value: string) => Promise<SelectOption | null> | SelectOption | null
}

export function SelectOrCreate({
    label,
    hint,
    error,
    required,

    value: propValue,
    defaultValue,
    options,
    className,

    placeholder = 'Select...',
    loading = false,
    loadingText = 'Loading...',
    disabled = false,
    name,
    onChange,
    onCreate,
}: SelectOrCreateProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
        string | undefined
    >(defaultValue)
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [creating, setCreating] = React.useState(false)

    const isControlled = propValue !== undefined
    const currentValue = isControlled ? propValue : uncontrolledValue

    const selected = options.find((o) => o.value === currentValue)

    const canCreate =
        Boolean(search.trim()) &&
        !options.some(
            (o) => o.label.toLowerCase() === search.trim().toLowerCase()
        )

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setUncontrolledValue(newValue)
        }
        onChange?.(newValue)
    }

    async function handleCreate() {
        if (!onCreate || creating) return

        setCreating(true)
        try {
            const created = await onCreate(search.trim())
            if (!created) throw new Error('Failed to create')
            handleValueChange(created.value)
            setSearch('')
            setOpen(false)
        } finally {
            setCreating(false)
        }
    }

    return (
        <Field
            id={name}
            label={label}
            hint={hint}
            error={error}
            required={required}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            controlBase,
                            controlBorder(error),
                            'flex h-10 w-full min-w-[150px] items-center justify-between px-3 text-left text-sm transition-colors',
                            disabled && 'cursor-not-allowed opacity-60',
                            className
                        )}
                    >
                        <span
                            className={cn(
                                'truncate',
                                selected
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                            )}
                        >
                            {selected?.label ?? placeholder}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[150px]  rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-1 shadow-xl outline-none"
                >
                    <Command className="flex flex-col overflow-hidden">
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Search..."
                            className="h-9 w-full border-0 border-b border-neutral-200 dark:border-neutral-800 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
                        />

                        <CommandList className="max-h-60 overflow-y-auto overflow-x-hidden p-1 py-2">
                            {loading ? (
                                <div className="py-6 text-center text-sm text-neutral-500">
                                    {loadingText}
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty className="p-2 text-sm text-neutral-500">
                                        {canCreate ? (
                                            <button
                                                type="button"
                                                onClick={handleCreate}
                                                disabled={creating}
                                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4 shrink-0" />
                                                <span className="truncate">
                                                    {creating
                                                        ? 'Creating...'
                                                        : `Create "${
                                                              search.length > 15
                                                                  ? `${search.slice(
                                                                        0,
                                                                        15
                                                                    )}...`
                                                                  : search
                                                          }"`}
                                                </span>
                                            </button>
                                        ) : (
                                            <div className="text-center py-2">
                                                No results found.
                                            </div>
                                        )}
                                    </CommandEmpty>

                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => {
                                                    handleValueChange(
                                                        option.value
                                                    )
                                                    setOpen(false)
                                                    setSearch('')
                                                }}
                                                className="relative mb-1 flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4 shrink-0',
                                                        currentValue ===
                                                            option.value
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                <span className="truncate">
                                                    {option.label}
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </Field>
    )
}
