import { useMemo, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import AppBodyWrapper from '../components/layout/AppBodyWrapper'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { useProducts } from '../features/product/hooks'
import type { Product } from '../features/product/types'
import { useCreateSale } from '../features/sales/hooks'
import type { SalePaymentMethod } from '../features/sales/types'
import { ProductSearch } from '../features/sales/components/ProductSearch'
import { SalesCart, SalesCartDrawer } from '../features/sales/components/SalesCart'
import type { CartItem } from '../features/sales/types'

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(value)

const Sales = () => {
    const { data: products = [], isLoading, isError } = useProducts()
    const { mutate: createSale, isPending } = useCreateSale()
    const [search, setSearch] = useState('')
    const [paymentMethod, setPaymentMethod] =
        useState<SalePaymentMethod>('cash')
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    const filteredProducts = useMemo(() => {
        const needle = search.trim().toLowerCase()
        if (!needle) return products

        return products.filter((product) =>
            product.name.toLowerCase().includes(needle)
        )
    }, [products, search])

    const addToCart = (product: Product) => {
        const units = product.productUnits ?? []
        const defaultUnit = units.find((unit) => unit.is_base_unit) ?? units[0]
        const unitId = defaultUnit?.id
        if (!unitId) return

        setCartItems((previous) => {
            const existing = previous.find(
                (item) =>
                    item.product.id === product.id && item.unitId === unitId
            )
            if (existing) {
                return previous.map((item) =>
                    item.product.id === product.id && item.unitId === unitId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...previous, { product, unitId, quantity: 1 }]
        })
    }

    const updateQuantity = (
        productId: string,
        unitId: string,
        delta: number
    ) => {
        setCartItems((previous) =>
            previous.map((item) =>
                item.product.id === productId && item.unitId === unitId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        )
    }

    const updateUnit = (
        productId: string,
        unitId: string,
        nextUnitId: string
    ) => {
        setCartItems((previous) =>
            previous.map((item) =>
                item.product.id === productId && item.unitId === unitId
                    ? { ...item, unitId: nextUnitId }
                    : item
            )
        )
    }

    const removeItem = (productId: string, unitId: string) => {
        setCartItems((previous) =>
            previous.filter(
                (item) =>
                    !(item.product.id === productId && item.unitId === unitId)
            )
        )
    }

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.selling_price * item.quantity,
        0
    )

    const handleCompleteSale = () => {
        if (!cartItems.length) return
        createSale(
            {
                items: cartItems.map((item) => ({
                    product_id: item.product.id,
                    unit_id: item.unitId,
                    quantity: item.quantity,
                })),
                payment_method: paymentMethod,
            },
            {
                onSuccess: () => {
                    setCartItems([])
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
        onUpdateQuantity: updateQuantity,
        onUpdateUnit: updateUnit,
        onRemoveItem: removeItem,
        onCompleteSale: handleCompleteSale,
        formatCurrency,
    }

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

                <div className="fixed bottom-4 right-4 z-40 xl:hidden">
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
