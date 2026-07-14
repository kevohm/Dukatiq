import { useMemo, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import AppBodyWrapper from '../components/layout/AppBodyWrapper'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { useProducts } from '../features/product/hooks'
import { useCreateSale } from '../features/sales/hooks'
import { ProductSearch } from '../features/sales/components/ProductSearch'
import {
    SalesCart,
    SalesCartDrawer,
} from '../features/sales/components/SalesCart'
import { useCart } from '../app/providers/CartProvider'
import { formatCurrency } from '../utils/currency'
import type { soldProduct } from '../features/sales/types'
import toast from 'react-hot-toast'

const Sales = () => {
    const { data: products = [], isLoading, isError } = useProducts()
    const { mutate: createSale, isPending } = useCreateSale()
    const {
        items: cartItems,
        paymentMethod,
        total,
        setPaymentMethod,
        addItem,
        removeItem,
        updateQuantity,
        changeUnit,
        clearCart,
        canAddUnitToCart,
    } = useCart()

    const [search, setSearch] = useState('')
    const [isCartOpen, setIsCartOpen] = useState(false)

    const filteredProducts = useMemo(() => {
        const needle = search.trim().toLowerCase()
        if (!needle) return products

        return products.filter((product) =>
            product.name.toLowerCase().includes(needle)
        )
    }, [products, search])

    const checkIfCanAddToCart = (
        productId: string,
        quantity: number,
        conversionFactor: number
    ) => {
        const canUnitBeSold = canAddUnitToCart(
            productId,
            quantity,
            conversionFactor
        )

        if (!canUnitBeSold) {
            toast.error('Not enough stock')
            return false
        }

        return true
    }

    const addToCart = (product: soldProduct) => {
        const canBeAddedCart = checkIfCanAddToCart(
            product?.id,
            1,
            product?.conversion_factor
        )
        if (!canBeAddedCart) return
        addItem(product)
    }

    const updateCart = (
        productId: string,
        unitId: string,
        delta: number,
        conversionFactor: number
    ) => {
        if (delta > 0) {
            const canBeAddedCart = checkIfCanAddToCart(
                productId,
                delta,
                conversionFactor
            )
            if (!canBeAddedCart) return
        }
        updateQuantity(productId, unitId, delta)
    }

    const updateUnit = (
        productId: string,
        unitId: string,
        nextUnitId: string
    ) => {
        changeUnit(productId, unitId, nextUnitId)
    }

    const handleCompleteSale = () => {
        if (!cartItems.length) return
        console.log(cartItems)
        createSale(
            {
                items: cartItems.map((item) => ({
                    product_id: item.product.id,
                    unit_id: item.unit_id,
                    quantity: item.quantity,
                })),
                payment_method: paymentMethod,
            },
            {
                onSuccess: () => {
                    clearCart()
                    setIsCartOpen(false)
                },
            }
        )
    }

    const cartProps = {
        cartItems,
        paymentMethod,
        total,
        isPending,
        onPaymentMethodChange: setPaymentMethod,
        onUpdateQuantity: updateCart,
        onUpdateUnit: updateUnit,
        onRemoveItem: removeItem,
        onCompleteSale: handleCompleteSale,
        formatCurrency,
    }

    // console.log(products)
    return (
        <AppBodyWrapper>
            <Topbar
                title="Point of Sale"
                subTitle="Search products and build a cart for quick checkout"
            />
            <div className="px-4 pb-6">
                <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <ProductSearch
                        products={filteredProducts}
                        search={search}
                        isLoading={isLoading}
                        isError={isError}
                        onSearchChange={setSearch}
                        onAddToCart={addToCart}
                        formatCurrency={formatCurrency}
                    />
                    <aside className="hidden xl:block">
                        <SalesCart {...cartProps} />
                    </aside>
                </div>

                <div className="fixed bottom-24  md:bottom-4 right-4 z-40 xl:hidden">
                    <Button
                        variant="primary"
                        type="button"
                        icon={<ShoppingCart size={18} />}
                        onClick={() => setIsCartOpen(true)}
                    >
                        Cart ({cartItems.length})
                    </Button>
                </div>
            </div>
            <SalesCartDrawer
                {...cartProps}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </AppBodyWrapper>
    )
}

export default Sales
