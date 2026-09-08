import { Trash2, Plus, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { TextInput } from '../../../components/ui/TextInput'
import type { IProductCreatePayload } from '../types'
import { useState } from 'react'

type ProductVariant = {
    cost_price: number
    selling_price: number
    attributes: Record<string, string[]>
}

type ProductFormBody = IProductCreatePayload & {
    variants?: ProductVariant[]
}

type ProductVariantsStepProps = {
    body: ProductFormBody
    onVariantChange: (
        index: number,
        field: 'selling_price' | 'cost_price' | 'attributes',
        value: string | number | Record<string, string[]>
    ) => void
    onAddVariant: () => void
    onRemoveVariant: (index: number) => void

    onAddAttribute: (variantIndex: number, name: string, value: string) => void
    onRemoveAttribute: (
        variantIndex: number,
        name: string,
        value?: string
    ) => void
}

type AttributeDraft = {
    name: string
    value: string
}

const normalizeAttributeName = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, '_')

const normalizeAttributeValue = (value: string, attributeName: string) => {
    const normalized = value.trim()

    if (attributeName === 'color') {
        return normalized.toLowerCase()
    }

    return normalized.toLowerCase().replace(/\s+/g, '_')
}
export function ProductVariantsStep({
    body,
    onVariantChange,
    onAddVariant,
    onRemoveVariant,
    onAddAttribute,
    onRemoveAttribute,
}: ProductVariantsStepProps) {
    const variants = body.variants ?? []

    const [drafts, setDrafts] = useState<Record<number, AttributeDraft>>({})

    const updateDraft = (
        index: number,
        field: keyof AttributeDraft,
        value: string
    ) => {
        setDrafts((current) => ({
            ...current,
            [index]: {
                name: current[index]?.name ?? '',
                value: current[index]?.value ?? '',
                [field]: value,
            },
        }))
    }

    const addAttribute = (index: number) => {
        const draft = drafts[index]

        const name = normalizeAttributeName(draft?.name ?? '')
        const value = normalizeAttributeValue(draft?.value ?? '', name)

        if (!name || !value) {
            return
        }

        onAddAttribute(index, name, value)

        setDrafts((current) => ({
            ...current,
            [index]: {
                name: '',
                value: '',
            },
        }))
    }

    const removeAttributeValue = (
        index: number,
        attributeName: string,
        value: string
    ) => {
        onRemoveAttribute(index, attributeName, value)
    }

    return (
        <div className="space-y-4">
            {variants.map((variant, index) => {
                const attributes = variant.attributes ?? {}
                const draft = drafts[index] ?? {
                    name: '',
                    value: '',
                }

                return (
                    <div
                        key={index}
                        className="space-y-5 rounded-xl border border-border bg-surface p-4 dark:border-slate-900 dark:bg-slate-950 dark:text-gray-300"
                    >
                        {/* Variant header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">Variant {index + 1}</h3>

                            {variants.length > 1 && (
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={() => onRemoveVariant(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <TextInput
                                label="Buying price"
                                name={`variants.${index}.cost_price`}
                                type="number"
                                required
                                value={variant.cost_price}
                                onChange={(e) =>
                                    onVariantChange(
                                        index,
                                        'cost_price',
                                        Number(e.target.value)
                                    )
                                }
                            />

                            <TextInput
                                label="Selling price"
                                name={`variants.${index}.selling_price`}
                                type="number"
                                required
                                value={variant.selling_price}
                                onChange={(e) =>
                                    onVariantChange(
                                        index,
                                        'selling_price',
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </div>

                        {/* Attributes */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-sm font-medium">
                                    Attributes
                                </h4>

                                <p className="text-xs text-muted">
                                    Add attributes such as color, size, or
                                    material.
                                </p>
                            </div>
                            {/* Existing attributes */}
                            {Object.entries(attributes).map(
                                ([name, values]) => {
                                    const normalizedName = normalizeAttributeName(name)
                                    const isColor = normalizedName === 'color'

                                    return (
                                        <div key={name} className="space-y-2.5">
                                            <span className="text-sm font-medium capitalize">
                                                {name}
                                            </span>

                                            <div className="flex flex-wrap gap-2">
                                                {values.map((value) => (
                                                    <div
                                                        key={value}
                                                        className={`group flex items-center gap-2 rounded-lg border border-border dark:border-slate-900 px-2.5 py-1.5 text-sm ${
                                                            isColor
                                                                ? 'bg-surface dark:bg-slate-950'
                                                                : ''
                                                        }`}
                                                    >
                                                        {isColor && (
                                                            <span
                                                                className="h-4 w-4 rounded-full border border-black/10 dark:border-white/10"
                                                                style={{
                                                                    backgroundColor:
                                                                        value,
                                                                }}
                                                            />
                                                        )}

                                                        <span className="">
                                                            {value}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeAttributeValue(
                                                                    index,
                                                                    name,
                                                                    value
                                                                )
                                                            }
                                                            className="rounded-md p-1 text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            )}

                            {/* Add attribute */}
                            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                                <TextInput
                                    label="Attribute"
                                    placeholder="e.g. Color"
                                    name={`variant-${index}-attribute-name`}
                                    value={draft.name}
                                    onChange={(e) =>
                                        updateDraft(
                                            index,
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />

                                {normalizeAttributeName(draft.name) === 'color' ? (
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">
                                            Color
                                        </label>

                                        <div className="flex h-10 items-center gap-2">
                                            <input
                                                type="color"
                                                value={
                                                    /^#[0-9A-Fa-f]{6}$/.test(
                                                        draft.value
                                                    )
                                                        ? draft.value
                                                        : '#000000'
                                                }
                                                onChange={(e) =>
                                                    updateDraft(
                                                        index,
                                                        'value',
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-10 cursor-pointer rounded-md border border-border bg-transparent p-1 dark:border-slate-900"
                                            />

                                            <TextInput
                                                label=""
                                                placeholder="#FF5733"
                                                name={`variant-${index}-attribute-value`}
                                                value={draft.value}
                                                onChange={(e) => {
                                                    let value = e.target.value

                                                    // Ensure it starts with #
                                                    if (
                                                        value &&
                                                        !value.startsWith('#')
                                                    ) {
                                                        value = `#${value}`
                                                    }

                                                    // Only allow valid hex characters
                                                    value = value
                                                        .replace(
                                                            /[^#0-9a-fA-F]/g,
                                                            ''
                                                        )
                                                        .slice(0, 7)

                                                    updateDraft(
                                                        index,
                                                        'value',
                                                        value
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <TextInput
                                        label="Value"
                                        placeholder="e.g. XL"
                                        name={`variant-${index}-attribute-value`}
                                        value={draft.value}
                                        onChange={(e) =>
                                            updateDraft(
                                                index,
                                                'value',
                                                e.target.value
                                            )
                                        }
                                    />
                                )}

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => addAttribute(index)}
                                    disabled={
                                        !draft.name.trim() ||
                                        !draft.value.trim()
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}

            <Button
                type="button"
                variant="secondary"
                onClick={onAddVariant}
                className="w-full"
            >
                <Plus className="mr-1 h-4 w-4" />
                Add another variant
            </Button>
        </div>
    )
}
