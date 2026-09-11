import { useCart } from "@/app/providers/CartProvider/CartProvider"

export function CartDescription() {
    const { cartStore } = useCart()
    const itemCount =
        cartStore?.carts?.[cartStore?.activeCartId]?.items?.length ?? 0

    return (
        <div className="w-full flex flex-wrap gap-2.5 justify-between">
            <span className="text-xs text-muted">
                Choose a cart or add multiple
            </span>
            <span className="text-xs text-muted">{itemCount} item(s)</span>
        </div>
    )
}
