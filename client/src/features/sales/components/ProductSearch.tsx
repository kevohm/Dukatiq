import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../../../components/ui/Button'
import { TextInput } from '../../../components/ui/TextInput'
import type { Product } from '../../../features/product/types'

type ProductSearchProps = {
    products: Product[]
    search: string
    isLoading: boolean
    isError: boolean
    onSearchChange: (value: string) => void
    onAddToCart: (product: Product) => void
    formatCurrency: (value: number) => string
}

export function ProductSearch({
    products,
    search,
    isLoading,
    isError,
    onSearchChange,
    onAddToCart,
    formatCurrency,
}: ProductSearchProps) {
    return (
        <section className="space-y-3">
            <TextInput
                placeholder="Search products"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                leadingIcon={Search}
            />

            <div className="mt-2 grid gap-2 md:grid-cols-2">
                {isLoading && <SearchState>Loading products...</SearchState>}
                {!isLoading && isError && (
                    <SearchState>Unable to load products right now.</SearchState>
                )}
                {!isLoading && !isError && !products.length && (
                    <SearchState>No products match your search.</SearchState>
                )}

                {!isLoading &&
                    !isError &&
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-xl border border-border p-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-heading">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-muted">
                                        {product.category?.name ?? 'Uncategorized'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-heading">
                                        {formatCurrency(product.selling_price)}
                                    </p>
                                    <p className="text-sm text-muted">
                                        Stock {product.stock_quantity}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-2">
                                <span className="text-xs text-muted">
                                    {product.productUnits?.length
                                        ? `${product.productUnits.length} unit option(s)`
                                        : 'No unit options'}
                                </span>
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => onAddToCart(product)}
                                >
                                    Add to cart
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    )
}

function SearchState({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted md:col-span-2">
            {children}
        </div>
    )
}
