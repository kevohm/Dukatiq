import { Button } from '../../../components/ui/Button'
import { Loader } from 'lucide-react'

type ProductStepFooterProps = {
    stepIndex: number
    stepCount: number
    isPending: boolean
    onPrevious: () => void
    onNext: () => void
}

export function ProductStepFooter({
    stepIndex,
    stepCount,
    isPending,
    onPrevious,
    onNext,
}: ProductStepFooterProps) {
    const isReviewStep = stepIndex === stepCount - 1

    return (
        <div className="flex items-center justify-between border-t border-border dark:border-slate-900 pt-4">
            <Button
                variant="secondary"
                type="button"
                onClick={(e) => {
                    e.preventDefault()
                    onPrevious?.()
                }}

                disabled={stepIndex === 0 || isPending}
            >
                Previous
            </Button>

            {isReviewStep ? (
                <Button variant="primary" type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Creating Product...
                        </>
                    ) : (
                        'Create Product'
                    )}
                </Button>
            ) : (
                <Button
                    variant="primary"
                    type="button"
                    onClick={(e) => {
                        e.preventDefault()
                        onNext?.()
                    }}
                >
                    Continue
                </Button>
            )}
        </div>
    )
}
