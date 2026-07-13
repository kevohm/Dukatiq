import { ImagePlus, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

type ProductImageStepProps = {
    previewUrl?: string
    error?: string
    isRemoving?: boolean
    onChange: (file?: File) => void
    onRemove: () => void
}

export function ProductImageStep({
    previewUrl,
    error,
    isRemoving = false,
    onChange,
    onRemove,
}: ProductImageStepProps) {
    return (
        <section className="space-y-3">
            <div>
                <h3 className="font-semibold text-heading">Product image</h3>
                <p className="text-sm text-muted">
                    Add an optional image for this product. PNG, JPEG, and WebP files up to 5 MB are supported.
                </p>
            </div>

            {previewUrl ? (
                <div className="relative w-fit">
                    <img
                        src={previewUrl}
                        alt="Selected product"
                        className="h-48 w-48 rounded-xl border border-border object-cover"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="absolute right-2 top-2 !px-2 !py-2"
                        onClick={onRemove}
                        disabled={isRemoving}
                        aria-label="Remove selected image"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 text-center hover:bg-hover">
                    <ImagePlus className="mb-2 h-7 w-7 text-muted" />
                    <span className="font-medium text-heading">Choose an image</span>
                    <span className="mt-1 text-sm text-muted">PNG, JPEG, or WebP - max 5 MB</span>
                    <input
                        type="file"
                        className="sr-only"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => onChange(event.target.files?.[0])}
                    />
                </label>
            )}

            {error ? <p className="text-sm text-danger">{error}</p> : null}
        </section>
    )
}
