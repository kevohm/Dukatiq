import { Select } from '@/components/ui/Select'
import { useProductUnitByProduct } from '@/features/product/product-unit/hooks'
import { useState } from 'react'

type props = { productId: string; onChange?: (value: string) => void; }

const UnitPicker: React.FC<props> = ({ productId, onChange }) => {
    const { data, isLoading, isError } = useProductUnitByProduct(productId)
    const [unitId, setUnitId] = useState<string | undefined>(undefined)
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error occurred</div>
    return (
        <Select
            loading={isLoading}
            error={isError ? 'Error occurred' : undefined}
            label="Unit"
            placeholder="Select unit"
            value={unitId}
            onChange={(event) => {
                setUnitId(event.target.value)
                onChange?.(event.target.value)
            }}
            options={
                data?.map((unit) => ({
                    value: unit?.unit?.id ?? "",
                    label: unit?.unit?.name ?? 'Unit',
                })) 
            }
            disabled={!productId}
        />
    )
}

export default UnitPicker
