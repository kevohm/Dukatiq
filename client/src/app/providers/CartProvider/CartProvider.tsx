import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'
import type {
    SalePaymentMethod,
    CartItem,
    Cart,
} from '../../../features/sales/types'
import { reducer } from './cart.reducer'
import { cartActions } from './cart.actions'

export interface ICartActionPayload {
    cart_id: string
    product_id: string
    unit_id: string
    quantity: number
    conversion_factor: number
}

type CartContextType = {
    cartStore: CartStore
    addItem: (payload: Omit<ICartActionPayload, 'cart_id'> & CartItem) => void

    removeItem: (
        payload: Pick<ICartActionPayload, 'product_id' | 'unit_id'>
    ) => void

    increaseQuantity: (
        payload: Pick<ICartActionPayload, 'product_id' | 'unit_id' | 'quantity'>
    ) => void
    decreaseQuantity: (
        payload: Pick<ICartActionPayload, 'product_id' | 'unit_id' | 'quantity'>
    ) => void

    clearCart: () => void
    adjustStockInCart: () => void
    canAddUnitToCart: (
        productId: string,
        quantity: number,
        conversionFactor?: number
    ) => boolean

    changeRecentlySoldCartId: (
        payload: Pick<ICartActionPayload, 'cart_id'>
    ) => void

    handleSaleCompletion: (payload: Pick<ICartActionPayload, 'cart_id'>) => void

    changeActiveCart: (payload: Pick<ICartActionPayload, 'cart_id'>) => void
    addNewCart: () => void
    resetRecentlySoldCartId: () => void
    deleteCart: (payload: Pick<ICartActionPayload, 'cart_id'>) => void

    setPaymentMethod: Dispatch<SetStateAction<SalePaymentMethod>>

    items: CartItem[]
    paymentMethod: SalePaymentMethod

    subtotal: number
    discount: number
    tax: number
    total: number
}

const CartContext = createContext<CartContextType | null>(null)

type Carts = Record<string, Cart>

export type CartStore = {
    activeCartId: string
    recentlySoldCartId: string
    status: 'error' | 'loading' | 'idle'
    message: string
    carts: Carts
}

const initialCart: CartStore = {
    activeCartId: '',
    recentlySoldCartId: '',
    carts: {},
    status: 'idle',
    message: '',
}

const CARTS_KEY = 'carts'

const initializeCart = (state: CartStore) => {
    const carts = sessionStorage.getItem(CARTS_KEY)
    const obj: CartStore = carts ? JSON.parse(carts) : state

    if (Object.keys(obj?.carts)?.length === 0) {
        const firstCart = {
            id: crypto.randomUUID(),
            total_cost: 0,
            total_amount: 0,
            items: [],
        }
        obj.carts[firstCart?.id] = firstCart
        obj.activeCartId = firstCart?.id
        sessionStorage.setItem(CARTS_KEY, JSON.stringify(obj))
        return obj
    }

    return obj
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartStore, dispatch] = useReducer(
        reducer,
        initialCart,
        initializeCart
    )
    // console.log(cartStore)

    const [items, setItems] = useState<CartItem[]>([])
    const [paymentMethod, setPaymentMethod] =
        useState<SalePaymentMethod>('cash')

    useEffect(() => {
        // console.log(cartStore)
        sessionStorage.setItem(CARTS_KEY, JSON.stringify(cartStore))
    }, [cartStore])

    useEffect(() => {
        if (!cartStore.recentlySoldCartId) return
        const cart = cartStore.carts[cartStore.recentlySoldCartId]
        if (!cart) {
            dispatch({
                type: cartActions.RESET_RECENTLY_SOLD_CART_ID,
            })
        }
    }, [cartStore.recentlySoldCartId])

    const currentCart = useMemo(() => {
        return cartStore.carts[cartStore?.activeCartId]
    }, [cartStore])

    const canAddUnitToCart = useCallback(
        (productId: string, quantity: number, conversionFactor = 1) => {
            const cartItems = currentCart?.items
            // Find any cart item for this product so we know its stock
            const productItem = cartItems.find(
                (item) => item.product_id === productId
            )

            // Product isn't in the cart yet, so nothing is reserved
            if (!productItem) {
                return true
            }

            // Reserved stock in base units across all units
            const reserved = cartItems
                .filter((item) => item.product_id === productId)
                .reduce(
                    (sum, item) => sum + item.quantity * item.conversion_factor,
                    0
                )

            const remaining = productItem.stock_quantity - reserved

            const required = quantity * conversionFactor

            return required <= remaining
        },
        [currentCart]
    )

    const addItem = ({
        conversion_factor = 1,
        ...payload
    }: Omit<ICartActionPayload, 'cart_id'> & CartItem) => {
        dispatch({
            type: cartActions.ADD_TO_CART,
            ...payload,
            conversion_factor,
        })
    }

    const removeItem = useCallback(
        (payload: Pick<ICartActionPayload, 'product_id' | 'unit_id'>) => {
            dispatch({
                type: cartActions.REMOVE_FROM_CART,
                ...payload,
            })
        },
        []
    )

    const increaseQuantity = useCallback(
        (
            payload: Pick<
                ICartActionPayload,
                'product_id' | 'unit_id' | 'quantity'
            >
        ) => {
            dispatch({
                type: cartActions.INCREASE_QUANTITY_IN_CART,
                ...payload,
            })
        },
        []
    )

    const decreaseQuantity = useCallback(
        (
            payload: Pick<
                ICartActionPayload,
                'product_id' | 'unit_id' | 'quantity'
            >
        ) => {
            dispatch({
                type: cartActions.DECREASE_QUANTITY_IN_CART,
                ...payload,
            })
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

    const handleSaleCompletion = useCallback(
        (payload: Pick<ICartActionPayload, 'cart_id'>) => {
            dispatch({
                type: cartActions.ON_SALE_COMPLETION,
                ...payload,
            })
        },
        []
    )

    const adjustStockInCart = useCallback(() => {
        dispatch({
            type: cartActions.ADJUST_CART_QUANTITY,
        })
    }, [])

    const deleteCart = useCallback(
        (payload: Pick<ICartActionPayload, 'cart_id'>) => {
            dispatch({
                type: cartActions.DELETE_NEW_CART,
                ...payload,
            })
        },
        []
    )

    const clearCart = useCallback(() => {
        dispatch({
            type: cartActions.CLEAR_CART,
        })
    }, [])

     const resetRecentlySoldCartId = useCallback(
         () => {
             dispatch({
                 type: cartActions.RESET_RECENTLY_SOLD_CART_ID,
             })
         },
         []
     )


    const changeRecentlySoldCartId = useCallback(
        (payload: Pick<ICartActionPayload, 'cart_id'>) => {
            dispatch({
                type: cartActions.SET_RECENTLY_SOLD_CART_ID,
                ...payload,
            })
        },
        []
    )

    const changeActiveCart = useCallback(
        (payload: Pick<ICartActionPayload, 'cart_id'>) => {
            dispatch({
                type: cartActions.CHANGE_ACTIVE_CART,
                ...payload,
            })
        },
        []
    )

    const addNewCart = useCallback(() => {
        dispatch({
            type: cartActions.ADD_NEW_CART,
        })
    }, [])
    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + item.selling_price * item.quantity,
                0
            ),
        [items]
    )

    const discount = 0
    const tax = 0

    const total = subtotal - discount + tax

    const value = useMemo(
        () => ({
            cartStore,
            addItem,
            removeItem,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            adjustStockInCart,
            changeRecentlySoldCartId,
            resetRecentlySoldCartId,
            changeActiveCart,
            addNewCart,
            deleteCart,
            handleSaleCompletion,

            items,
            paymentMethod,
            subtotal,
            discount,
            tax,
            total,

            setPaymentMethod,
            setQuantity,
            changeUnit,
            canAddUnitToCart,
        }),
        [
            cartStore,
            addItem,
            removeItem,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            changeRecentlySoldCartId,
            resetRecentlySoldCartId,
            adjustStockInCart,
            changeActiveCart,
            addNewCart,
            deleteCart,
            handleSaleCompletion,

            items,
            paymentMethod,
            subtotal,
            total,
            setQuantity,
            changeUnit,
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
