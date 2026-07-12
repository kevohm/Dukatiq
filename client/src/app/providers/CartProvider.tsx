import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type {
    CartItem,
    SalePaymentMethod,
    soldProduct,
} from '../../features/sales/types'

type CartContextType = {
    items: CartItem[]
    paymentMethod: SalePaymentMethod

    subtotal: number
    discount: number
    tax: number
    total: number

    setPaymentMethod: (method: SalePaymentMethod) => void

    addItem: (product: soldProduct, quantity?: number) => void

    removeItem: (productId: string, unitId: string) => void

    updateQuantity: (productId: string, unitId: string, delta: number) => void

    setQuantity: (productId: string, unitId: string, quantity: number) => void

    changeUnit: (
        productId: string,
        currentUnitId: string,
        nextUnitId: string
    ) => void

    clearCart: () => void
    canAddUnitToCart: (
        productId: string,
        quantity: number,
        conversionFactor?: number
    ) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [paymentMethod, setPaymentMethod] =
        useState<SalePaymentMethod>('cash')

    useEffect(() => {
        const saved = sessionStorage.getItem('sales-cart')

        if (saved) {
            setItems(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem('sales-cart', JSON.stringify(items))
    }, [items])



    const canAddUnitToCart = useCallback(
        (productId: string, quantity: number, conversionFactor = 1) => {
            // Find any cart item for this product so we know its stock
            const productItem = items.find(
                (item) => item.product_id === productId
            )

            // Product isn't in the cart yet, so nothing is reserved
            if (!productItem) {
                return true
            }

            // Reserved stock in base units across all units
            const reserved = items
                .filter((item) => item.product_id === productId)
                .reduce(
                    (sum, item) =>
                        sum + item.quantity * item.product.conversion_factor,
                    0
                )

            const remaining = productItem.product.stock_quantity - reserved

            const required = quantity * conversionFactor

            return required <= remaining
        },
        [items]
    )
    const addItem = useCallback((data: soldProduct, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) =>
                    item.product_id === data.id && item.unit_id === data.unit_id
            )

            if (existing) {
                return prev.map((item) =>
                    item.product_id === data.id && item.unit_id === data.unit_id
                        ? {
                              ...item,
                              quantity: item.quantity + quantity,
                          }
                        : item
                )
            }

            return [
                ...prev,
                {
                    product: data,
                    quantity,
                    unitId: data.unit_id,
                    unit_id: data.unit_id,
                    product_id: data.id,
                },
            ]
        })
    }, [])

    const removeItem = useCallback((productId: string, unitId: string) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    !(item.product_id === productId && item.unit_id === unitId)
            )
        )
    }, [])

    const updateQuantity = useCallback(
        (productId: string, unitId: string, delta: number) => {
            setItems((prev) =>
                prev
                    .map((item) => {
                        if (
                            item.product_id !== productId ||
                            item.unit_id !== unitId
                        )
                            return item

                        return {
                            ...item,
                            quantity: Math.max(1, item.quantity + delta),
                        }
                    })
                    .filter((item) => item.quantity > 0)
            )
        },
        []
    )

    const setQuantity = useCallback(
        (productId: string, unitId: string, quantity: number) => {
            setItems((prev) =>
                prev.map((item) =>
                    item.product_id === productId && item.unit_id === unitId
                        ? {
                              ...item,
                              quantity: Math.max(1, quantity),
                          }
                        : item
                )
            )
        },
        []
    )

    const changeUnit = useCallback(
        (productId: string, currentUnitId: string, nextUnitId: string) => {
            setItems((prev) =>
                prev.map((item) =>
                    item.product_id === productId &&
                    item.unit_id === currentUnitId
                        ? {
                              ...item,
                              unitId: nextUnitId,
                          }
                        : item
                )
            )
        },
        []
    )

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + item.product.selling_price * item.quantity,
                0
            ),
        [items]
    )

    const discount = 0
    const tax = 0

    const total = subtotal - discount + tax

    const value = useMemo(
        () => ({
            items,
            paymentMethod,
            subtotal,
            discount,
            tax,
            total,
            setPaymentMethod,
            addItem,
            removeItem,
            updateQuantity,
            setQuantity,
            changeUnit,
            clearCart,
            canAddUnitToCart,
        }),
        [
            items,
            paymentMethod,
            subtotal,
            total,
            addItem,
            removeItem,
            updateQuantity,
            setQuantity,
            changeUnit,
            clearCart,
            canAddUnitToCart,
        ]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart must be used inside CartProvider')
    }

    return context
}
