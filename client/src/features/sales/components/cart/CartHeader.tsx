
import {
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card'
import { CartTitle } from './CartTitle'
import { CartDescription } from './CartDescription'



export function CartHeader() {
    return (
        <CardHeader className=" px-4 py-3 flex-col gap-3">
            <CardTitle className="w-full text-base flex items-center justify-between gap-2.5">
                <CartTitle />
            </CardTitle>
            <CardDescription className="w-full flex justify-between">
                <CartDescription />
            </CardDescription>
        </CardHeader>
    )
}
