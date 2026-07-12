import { Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { TextInput } from '../../../components/ui/TextInput'
import type { IProductCreatePayload } from '../types'

type ProductFormBody = IProductCreatePayload & {
    units?: Array<{
        unit_name: string
        conversion_factor: number
        is_base_unit: boolean
    }>
}

type ProductUnitsStepProps = {
    body: ProductFormBody
    onUnitChange: (
        index: number,
        field: 'unit_name' | 'conversion_factor',
        value: string | number
    ) => void
    onAddUnit: () => void
    onRemoveUnit: (index: number) => void
}

export function ProductUnitsStep({
    body,
    onUnitChange,
    onAddUnit,
    onRemoveUnit,
}: ProductUnitsStepProps) {
    const units = body.units ?? []

    return (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
            <div className="grid grid-cols-[2fr_1fr_auto] gap-3 text-sm font-medium text-muted">
                <span>Unit</span>
                <span>Conversion</span>
                <span />
            </div>

            {units.map((unit, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[2fr_1fr_auto] items-end gap-3"
                >
                    <TextInput
                        label={index === 0 ? 'Base Unit' : ''}
                        placeholder="Piece, Box, Carton..."
                        value={unit.unit_name}
                        onChange={(e) =>
                            onUnitChange(index, 'unit_name', e.target.value)
                        }
                    />

                    <TextInput
                        label={index === 0 ? 'Conversion' : ''}
                        type="number"
                        value={unit.conversion_factor}
                        onChange={(e) =>
                            onUnitChange(
                                index,
                                'conversion_factor',
                                Number(e.target.value)
                            )
                        }
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => onRemoveUnit(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="secondary"
                onClick={onAddUnit}
                className="w-full"
            >
                + Add another unit
            </Button>
        </div>
    )
}
