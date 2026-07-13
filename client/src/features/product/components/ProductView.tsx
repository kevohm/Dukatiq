
import {
    Boxes,
    Package,
    Tag,
    DollarSign,
    Warehouse,
    Layers,
    
    ImageIcon,
} from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { Product } from '../types'
import { FileImage } from '../../file/components/FileImage'


interface Props {
    product: Product
}

export default function ProductView({ product }: Props) {
    const profit = product.selling_price - product.cost_price
    const lowStock = product.stock_quantity <= product.low_stock_threshold
    const baseUnit = product.productUnits.find((u) => u.is_base_unit)

    return (
        <div className="space-y-8">
       

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <DollarSign className="w-5 h-5 mb-3 text-brand" />
                    <p className="text-sm text-muted">Selling Price</p>
                    <h2 className="text-2xl font-semibold">
                        KSh {product.selling_price}
                    </h2>
                </Card>

                <Card>
                    <DollarSign className="w-5 h-5 mb-3 text-brand" />
                    <p className="text-sm text-muted">Cost Price</p>
                    <h2 className="text-2xl font-semibold">
                        KSh {product.cost_price}
                    </h2>
                </Card>

                <Card>
                    <Warehouse className="w-5 h-5 mb-3 text-brand" />
                    <p className="text-sm text-muted">Stock</p>

                    <h2
                        className={`text-2xl font-semibold ${
                            lowStock ? 'text-red-600' : 'text-green-600'
                        }`}
                    >
                        {product.stock_quantity}
                    </h2>
                </Card>

                <Card>
                    <Boxes className="w-5 h-5 mb-3 text-brand" />
                    <p className="text-sm text-muted">Profit / Unit</p>

                    <h2 className="text-2xl font-semibold">KSh {profit}</h2>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Image */}
                <Card className="flex items-center justify-center min-h-72">
                    {product.image_key ? (
                        <FileImage
                            fileKey={product.image_key}
                            alt={product.name}
                            className="object-contain max-h-64"
                            fallback={<span className="text-muted">Loading product image...</span>}
                        />
                    ) : product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="object-contain max-h-64"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-muted">
                            <ImageIcon className="w-12 h-12 mb-3" />
                            No product image
                        </div>
                    )}
                </Card>

                {/* Details */}
                <Card className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-6">
                        Product Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Detail
                            icon={<Tag className="w-4 h-4" />}
                            label="Category"
                            value={product.category.name}
                        />

                        <Detail
                            icon={<Package className="w-4 h-4" />}
                            label="Brand"
                            value={product.brand.name}
                        />

                        <Detail
                            icon={<Warehouse className="w-4 h-4" />}
                            label="Current Stock"
                            value={product.stock_quantity}
                        />

                        <Detail
                            icon={<Layers className="w-4 h-4" />}
                            label="Low Stock Alert"
                            value={product.low_stock_threshold}
                        />

                        <Detail
                            icon={<Boxes className="w-4 h-4" />}
                            label="Base Unit"
                            value={baseUnit?.unit.name ?? '-'}
                        />
                    </div>
                </Card>
            </div>

            {/* Units */}
            <Card>
                <h2 className="text-lg font-semibold mb-5">Inventory Units</h2>

                <div className="space-y-3">
                    {product.productUnits.map((unit) => (
                        <div
                            key={unit.id}
                            className="flex justify-between items-center rounded-lg border border-border p-4"
                        >
                            <div>
                                <div className="font-medium">
                                    {unit.unit.name}
                                </div>

                                <div className="text-sm text-muted">
                                    Conversion: {unit.conversion_factor}
                                </div>
                            </div>

                            {unit.is_base_unit && (
                                <Badge color="green">Base Unit</Badge>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

function Detail({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 text-muted">{icon}</div>

            <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
}
