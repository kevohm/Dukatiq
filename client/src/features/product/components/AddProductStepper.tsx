import {
    BadgeDollarSign,
    Check,
    CircleDollarSign,
    Package2,
    ScanSearch,
} from 'lucide-react'

const steps = [
    {
        label: 'Basic',
        icon: Package2,
    },
    {
        label: 'Pricing',
        icon: BadgeDollarSign,
    },
    {
        label: 'Units',
        icon: CircleDollarSign,
    },
    {
        label: 'Review',
        icon: ScanSearch,
    },
] as const

type AddProductStepperProps = {
    stepIndex: number
}

export function AddProductStepper({ stepIndex }: AddProductStepperProps) {
    return (
        <div className="sticky top-18 rounded-xl border border-border bg-surface p-4 ">
            <div className="flex items-center ">
                {steps.map((step, index) => {
                    const Icon = step.icon

                    const active = index === stepIndex
                    const complete = index < stepIndex

                    return (
                        <div
                            key={step.label}
                            className=" flex flex-1 items-center"
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className={[
                                        'flex h-8 w-8 items-center justify-center rounded-full border transition-all',
                                        complete
                                            ? 'border-brand bg-brand text-white'
                                            : active
                                              ? 'border-brand bg-brand/10 text-brand'
                                              : 'border-border bg-background text-muted',
                                    ].join(' ')}
                                >
                                    {complete ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Icon className="h-4 w-4" />
                                    )}
                                </div>

                                <span
                                    className={[
                                        'mt-1 text-xs',
                                        active
                                            ? 'font-medium text-heading'
                                            : 'text-muted',
                                    ].join(' ')}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={[
                                        'mx-2 mb-5 h-px flex-1 rounded-full',
                                        complete ? 'bg-brand' : 'bg-border',
                                    ].join(' ')}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
