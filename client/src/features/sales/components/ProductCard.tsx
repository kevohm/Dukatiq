import { Badge } from '@/components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/currency'
import type { Product } from '../../product/types'
import type { soldProduct } from '../types'

type ProductCardProps = {
    product: Product
    onAddToCart: (product: soldProduct) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-xl border border-border p-3 bg-surface">
            {/* Top Row: Product Info & Base Price */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-heading">{product.name}</p>
                    <div className="flex flex-wrap gap-2.5">
                        <Badge color="gray" >
                            {product.category?.name ?? 'Uncategorized'}
                        </Badge>
                        <Badge color="orange">
                            {product.brand?.name ?? 'Uncategorized'}
                        </Badge>
                    </div>
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

            {/* Bottom Row: Dynamic Unit Action Buttons */}
            <div className="mt-3  pt-2.5">
                <div className="flex flex-wrap gap-1.5">
                    {product.productUnits && product.productUnits.length > 0 ? (
                        product.productUnits.map((productUnit) => (
                            <Button
                                key={productUnit?.id}
                                variant="secondary"
                                type="button"
                                className="text-xs px-2.5 w-max py-1 h-auto justify-center border border-border hover:bg-hover hover:text-heading"
                                onClick={() =>
                                    onAddToCart({
                                        id: product?.id,
                                        name: product?.name,
                                        cost_price: product?.cost_price,
                                        selling_price: product?.selling_price,
                                        stock_quantity: product?.stock_quantity,
                                        conversion_factor:
                                            productUnit?.conversion_factor,
                                        is_base_unit: productUnit?.is_base_unit,
                                        unit_name: productUnit?.unit?.name,
                                        unit_id: productUnit?.unit?.id,
                                    })
                                }
                            >
                                + {productUnit.unit?.name ?? 'Unit'}
                            </Button>
                        ))
                    ) : (
                        <span className="text-xs text-muted italic">
                            No units configured
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
