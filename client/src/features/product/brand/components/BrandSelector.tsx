import {
    SelectOrCreate,
    type SelectOption,
} from '@/components/ui/SelectOrCreate'
import { useCreateProductBrand, useProductBrands } from '../hooks'

const BrandSelector = ({
    onChange,
    value,
}: {
    onChange: (value: string) => void
    value?: string
}) => {
    const { data, isLoading, isError } = useProductBrands()
    const { mutateAsync, isPending } = useCreateProductBrand()
    const handleCreate = async (
        value: string
    ) => {
        try {
            const brand = await mutateAsync(value)
            return {
                value: brand?.id,
                label: value,
            } 
        } catch {
        }
        return null
    }
    return (
        <SelectOrCreate
            label="Brand"
            name="brand_id"
            required
            value={value}
            error={isError ? 'Error fetching brands' : ''}
            loading={isLoading}
            loadingText="Fetching brands..."
            disabled={isLoading || isPending}
            onChange={onChange}
            onCreate={handleCreate}
            options={
                data?.data?.map((c: any) => ({
                    label: c?.name,
                    value: c?.id,
                })) as SelectOption[]
            }
        />
    )
}

export default BrandSelector
