import {
    SelectOrCreate,
    type SelectOption,
} from '@/components/ui/SelectOrCreate'
import { useCreateProductCategory, useProductCategories } from '../hooks'

const CategorySelector = ({
    onChange,
    value,
}: {
    onChange: (value: string) => void
    value?: string
}) => {
    const { data, isLoading, isError } = useProductCategories()
    const { mutateAsync, isPending } = useCreateProductCategory()
    const handleCreate = async (value: string) => {
        try {
            const cat = await mutateAsync(value)
            return {
                value: cat?.id,
                label: cat?.name,
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }
    return (
        <SelectOrCreate
            label="Category"
            name="category_id"
            required
            value={value}
            error={isError ? 'Error fetching categories' : ''}
            loading={isLoading}
            loadingText="Fetching categories..."
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

export default CategorySelector
