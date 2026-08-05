import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/Card'
import { FileImage } from '../../file/components/FileImage'

type Props = {
    body: {
        name: string
        category: string
        brand: string
        cost_price: number
        selling_price: number
        image_key?: string
        units?: {
            unit_name: string
            conversion_factor: number
            is_base_unit: boolean
        }[]
    }
}

export function ProductReviewStep({ body }: Props) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Product Image</CardTitle>
                </CardHeader>

                <CardContent>
                    {body.image_key ? (
                        <FileImage
                            fileKey={body.image_key}
                            alt={body.name}
                            className="h-32 w-32 rounded-lg border border-border object-cover"
                        />
                    ) : (
                        <p className="text-sm text-muted">No image selected</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2">
                    <Info label="Name" value={body.name} />
                    <Info label="Category" value={body.category} />
                    <Info label="Brand" value={body.brand} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-3 sm:grid-cols-2">
                    <Info
                        label="Buying Price"
                        value={`KES ${body.cost_price}`}
                    />

                    <Info
                        label="Selling Price"
                        value={`KES ${body.selling_price}`}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Units</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="divide-y  dark:divide-slate-900">
                        {body.units?.map((unit) => (
                            <div
                                key={unit.unit_name}
                                className="flex items-center justify-between py-3"
                            >
                                <div>
                                    <p className="font-medium dark:text-slate-500">
                                        {unit.unit_name}
                                    </p>

                                    {unit.is_base_unit && (
                                        <span className="text-xs rounded bg-brand/10 px-2 py-1 text-brand">
                                            Base Unit
                                        </span>
                                    )}
                                </div>

                                <span className="text-muted dark:text-slate-500">
                                    ×{unit.conversion_factor}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-xl border border-brand/20  bg-brand/5 p-4">
                <h3 className="font-medium dark:text-slate-300">
                    Ready to create this product?
                </h3>

                <p className="mt-1 text-sm text-muted dark:text-slate-500">
                    Review the information above. Click
                    <strong> Create Product </strong>
                    to save it.
                </p>
            </div>
        </div>
    )
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted dark:text-slate-300">
                {label}
            </p>

            <p className="font-medium dark:text-slate-500">{value}</p>
        </div>
    )
}
