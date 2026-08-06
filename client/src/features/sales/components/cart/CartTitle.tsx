import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/app/providers/CartProvider/CartProvider'
import { useState } from 'react'

export function CartTitle() {
    const { cartStore, changeActiveCart, addNewCart, deleteCart } = useCart()
    const carts = cartStore?.carts ?? {}
    const [isDeleted, setIsDeleted] = useState<string[]>([])
    return (
        <div className="w-full text-base flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
                {Object.values(carts ?? {})?.map((cart, idx) => {
                    const isAcitve = cartStore?.activeCartId === cart?.id
                    if (isDeleted?.includes(cart?.id)) {
                        return null
                    }
                    return (
                        <div className="relative group flex">
                            <Button
                                key={cart?.id}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    changeActiveCart({
                                        cart_id: cart?.id,
                                    })
                                }}
                                className={`ease-in-out ${
                                    Object.keys(carts)?.length > 1
                                        ? 'group-hover:pr-10'
                                        : ''
                                } transition-all duration-200 outline-none ring-none capitalize`}
                                variant={isAcitve ? 'primary' : 'secondary'}
                            >
                                cart {idx + 1}
                            </Button>
                            {Object.keys(carts)?.length > 1 && (
                                <div className="hidden  group-hover:block transition-all ease-in-out duration-150  absolute top-1/2 -translate-y-1/2  right-1">
                                    <button
                                        className="p-1 rounded-md bg-white"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            if (
                                                Object.keys(carts)?.length <= 1
                                            ) {
                                                return
                                            }

                                            deleteCart({ cart_id: cart?.id })

                                            setIsDeleted((prev) => [
                                                ...prev,
                                                cart?.id,
                                            ])
                                        }}
                                    >
                                        <X className="w-3 h-3 text-danger" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}

                <Button
                    type="button"
                    variant="ghost"
                    className="block md:hidden"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={(e) => {
                        e.preventDefault()
                        addNewCart()
                    }}
                />
            </div>
            <Button
                type="button"
                variant="ghost"
                className="md:block hidden"
                icon={<Plus className="w-4 h-4" />}
                onClick={(e) => {
                    e.preventDefault()
                    addNewCart()
                }}
            />
        </div>
    )
}
