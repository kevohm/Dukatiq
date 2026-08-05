import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import type { Product } from '../../../features/product/types'

import { ProductCard } from './ProductCard'
import type { soldProduct } from '../types'
import { useProductCategories } from '@/features/product/category/hooks'
import { useProductBrand } from '@/features/product/brand/hooks'
import { Select } from '@/components/ui/Select'

type ProductSearchProps = {
    products: Product[]
    search: string
    isLoading: boolean
    isError: boolean
    onSearchChange: (value: string) => void
    onAddToCart: (product: soldProduct) => void
    formatCurrency: (value: number) => string
}

export function ProductSearch({
    products,
    search,
    isLoading,
    isError,
    onSearchChange,
    onAddToCart,
}: ProductSearchProps) {
    const categoryQuery = useProductCategories()
    const brandQuery = useProductBrand()
    return (
        <section className="space-y-3">
            <div className="flex gap-2.5">
                <div className="flex-1">
                    <TextInput
                        placeholder="Search products"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        leadingIcon={Search}
                    />
                </div>
                <Select
                    name="category"
                    placeholder="select category"
                    loading={categoryQuery?.isLoading}
                    options={[]}
                />
                <Select
                    name="brand"
                    placeholder="brand category"
                    loading={brandQuery?.isLoading}
                    options={[]}
                />
            </div>

            <div className="mt-2 grid gap-2 md:grid-cols-2">
                {isLoading && <SearchState>Loading products...</SearchState>}
                {!isLoading && isError && (
                    <SearchState>
                        Unable to load products right now.
                    </SearchState>
                )}
                {!isLoading && !isError && !products.length && (
                    <SearchState>No products match your search.</SearchState>
                )}

                {!isLoading &&
                    !isError &&
                    products.map((product) => (
                        <ProductCard
                            key={product?.id}
                            product={product}
                            onAddToCart={onAddToCart}
                        />
                    ))}
            </div>
        </section>
    )
}

function SearchState({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-dashed border-border dark:border-slate-900 p-4 text-sm text-muted dark:text-slate-500 md:col-span-2">
            {children}
        </div>
    )
}
