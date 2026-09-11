import type { Cart } from '@/features/sales/types'
import { cartActions, type cartActionKey } from './cart.actions'
import type { CartStore } from './CartProvider'

type ReducerArgs = {
    state: CartStore
    payload: Record<string, any> & {
        cart_id?: string
        type: cartActionKey
    }
}
export const reducer = (
    state: CartStore,
    payload: Record<string, any> & {
        type: cartActionKey
    }
) => {
    const { type } = payload

    switch (payload?.type) {
        case cartActions.ADD_TO_CART: {
            return Reducers.addToCart({ state, payload })
        }

        case cartActions.INCREASE_QUANTITY_IN_CART: {
            return Reducers.increaseQuantityInCart({ state, payload })
        }

        case cartActions.DECREASE_QUANTITY_IN_CART: {
            return Reducers.decreaseQuantityInCart({ state, payload })
        }

        case cartActions.REMOVE_FROM_CART: {
            // recieves productId, unitId
            return Reducers.removeFromCart({ state, payload })
        }
        case cartActions.CLEAR_CART: {
            return Reducers.clearCart({ state, payload })
        }

        case cartActions.CHANGE_ACTIVE_CART: {
            return Reducers.changeActiveCart({ state, payload })
        }

        case cartActions.ADD_NEW_CART: {
            return Reducers.addNewCart({ state, payload })
        }

        case cartActions.DELETE_NEW_CART: {
            return Reducers.deleteCart({ state, payload })
        }

        case cartActions.ADJUST_CART_QUANTITY: {
            return Reducers.adjustCartQuantity({ state, payload })
        }

        case cartActions.SET_RECENTLY_SOLD_CART_ID: {
            return Reducers.setRecentlySoldCartId({ state, payload })
        }
        case cartActions.RESET_RECENTLY_SOLD_CART_ID: {
            return Reducers.resetRecentlySoldCartId({ state, payload })
        }
        case cartActions.ON_SALE_COMPLETION: {
            return Reducers.onSaleCompletion({ state, payload })
        }
        default:
            throw new Error(`Invalid state ${type}`)
    }
}

class Reducers {
    private static MAX_CART_AT_A_TIME = 4

    static onSaleCompletion({ state, payload }: ReducerArgs) {
        const firstNewState = this.adjustCartQuantity({ state, payload })
        const secondNewState = this.deleteCart({
            state: firstNewState,
            payload,
        })
        return this.resetRecentlySoldCartId({ state: secondNewState, payload })
    }

    static resetRecentlySoldCartId({ state }: ReducerArgs) {
        return {
            ...state,
            recentlySoldCartId: '',
        }
    }

    static setRecentlySoldCartId({ state, payload }: ReducerArgs) {
        const cartId = payload?.cart_id
        if (!cartId) {
            return state
        }
        if (state.carts[cartId]) {
            return {
                ...state,
                recentlySoldCartId: cartId,
            }
        }
        return state
    }
    static adjustCartQuantity({ state }: ReducerArgs) {
        const cartId = state.recentlySoldCartId
        if (!cartId) {
            return state
        }
        // recieves nothing
        const cart = state.carts[cartId]

        // console.log('ADJUSTING CART: ', cartId)

        const productQuantities: Record<string, number> = {}

        for (const item of cart?.items) {
            if (!Object.hasOwn(productQuantities, item.product_id)) {
                productQuantities[item?.product_id] = item.stock_quantity
            }
            const quantity =
                item.normalized_quantity ??
                item.quantity * item.conversion_factor
            const store = productQuantities[item?.product_id]
            if (store >= quantity) {
                productQuantities[item?.product_id] -=
                    item.normalized_quantity ??
                    item.quantity * item.conversion_factor
            } else {
                console.error(
                    `[${cartId}]:Invalid stock for prod: ${item.product_id} and unit: ${item.unit_id}`
                )
            }
        }
        const carts = Object.entries(state.carts)?.reduce((prev, curr) => {
            const [id, c] = curr

            const items = c?.items?.map((item) => {
                if (!productQuantities[item?.product_id]) {
                    return item
                }
                return {
                    ...item,
                    stock_quantity: productQuantities[item?.product_id],
                }
            })
            return { ...prev, [id]: { ...c, items } }
        }, {} as Record<string, Cart>)

        return { ...state, carts }
    }
    static deleteCart({ state, payload }: ReducerArgs) {
        // recieves nothing
        const cartId = payload?.cart_id
        if (!cartId) return state
        // console.log('DELETING CART: ', cartId)
        
        if (Object.keys(state.carts)?.length === 1){
             return state
        }


        const cart = state.carts[cartId]

        if (cart) {
            const carts = state.carts
            delete carts[cartId]
            const availableCartIds = Object.keys(carts)?.filter(
                (id) => id !== cartId
            )
            // console.log('AVAILABLE CARTS: ', availableCartIds)
            if (availableCartIds.length > 0) {
                return {
                    ...state,
                    activeCartId: availableCartIds[0],
                    carts,
                }
            }
            return { ...state, activeCartId: '', carts }
        }
        return state
    }

    static addNewCart({ state}: ReducerArgs) {
        if (Object.keys(state.carts)?.length >= this.MAX_CART_AT_A_TIME) {
            return state
        }
        // recieves nothing
        let newCart = {
            id: crypto.randomUUID(),
            total_cost: 0,
            total_amount: 0,
            items: [],
        }
        while (state.carts[newCart?.id]) {
            newCart['id'] = crypto.randomUUID()
        }

        return {
            ...state,
            activeCartId: newCart?.id,
            carts: {
                ...state.carts,
                [newCart?.id]: newCart,
            },
        }
    }

    static changeActiveCart({ state, payload }: ReducerArgs) {
        // recieves cartId
        const cartId = payload?.cart_id
        if (!cartId) return state
        const cart = state?.carts[cartId]
        if (cartId === state?.activeCartId) return state

        if (cart) {
            return {
                ...state,
                activeCartId: cartId,
            }
        }
        return state
    }

    static clearCart({ state, payload }: ReducerArgs) {
        // recieves productId, unitId
        const cartId = state?.activeCartId
        const cart = state?.carts[cartId]
        if (!cart) {
            return state
        }

        let total_amount = cart?.total_amount ?? 0
        let total_cost = cart?.total_cost ?? 0
        const itemRemoved = cart?.items?.find(
            (item) =>
                item.unit_id == payload.unit_id &&
                item.product_id == payload.product_id
        )
        if (!itemRemoved) return state

        total_amount -= itemRemoved?.selling_price * itemRemoved?.quantity
        total_cost -= itemRemoved?.cost_price * itemRemoved?.quantity

        const items = cart?.items?.filter(
            (item) =>
                !(
                    item.unit_id == payload.unit_id &&
                    item.product_id == payload.product_id
                )
        )
        return {
            ...state,
            carts: {
                ...state?.carts,
                [cartId]: {
                    ...cart,
                    total_amount,
                    total_cost,
                    items,
                },
            },
        }
    }

    static removeFromCart({ state }: ReducerArgs) {
        // recieves cartId
        const cartId = state?.activeCartId
        const cart = state?.carts[cartId]
        if (cart) {
            return {
                ...state,
                carts: {
                    ...state?.carts,
                    [cartId]: {
                        ...cart,
                        total_amount: 0,
                        total_cost: 0,
                        items: [],
                    },
                },
            }
        }
        return state
    }

    static decreaseQuantityInCart({ state, payload }: ReducerArgs) {
        // recieves productId, unitId, quantity, conversion_rate
        const cartId = state?.activeCartId
        const cart = state?.carts[cartId]

        let total_amount = cart?.total_amount ?? 0
        let total_cost = cart?.total_cost ?? 0

        if (cart) {
            const items = cart?.items
                .map((item) => {
                    const quantity = Math.abs(parseInt(payload?.quantity))

                    const normalizedQuantity =
                        parseInt(payload?.conversion_factor) *
                        parseInt(payload?.quantity)

                    if (
                        item.product_id !== payload?.product_id ||
                        item.unit_id !== payload?.unit_id
                    ) {
                        return item
                    }

                    total_amount += quantity * item?.selling_price
                    total_cost += quantity * item?.cost_price

                    return {
                        ...item,
                        quantity: Math.max(0, item.quantity - quantity),
                        normalized_quantity: Math.max(
                            0,
                            item.normalized_quantity - normalizedQuantity
                        ),
                    }
                })
                .filter((item) => item.quantity > 0)

            return {
                ...state,
                carts: {
                    ...state?.carts,
                    [cartId]: { ...cart, total_amount, total_cost, items },
                },
            }
        }
        return state
    }

    static increaseQuantityInCart({ state, payload }: ReducerArgs) {
        // recieves productId, unitId, quantity, conversion_rate
        const cartId = state?.activeCartId
        const cart = state?.carts[cartId]
        let total_amount = cart?.total_amount ?? 0
        let total_cost = cart?.total_cost ?? 0

        if (cart) {
            const items = cart?.items
                .map((item) => {
                    const quantity = parseInt(payload?.quantity)

                    const normalizedQuantity =
                        parseInt(payload?.conversion_factor) *
                        parseInt(payload?.quantity)
                    if (
                        item.product_id !== payload?.product_id ||
                        item.unit_id !== payload?.unit_id
                    ) {
                        return item
                    }

                    total_amount += item?.selling_price
                    total_cost += item?.cost_price

                    return {
                        ...item,
                        quantity: item.quantity + Math.abs(quantity),
                        normalized_quantity:
                            item.normalized_quantity +
                            Math.abs(normalizedQuantity),
                    }
                })
                .filter((item) => item.quantity > 0)

            return {
                ...state,
                carts: {
                    ...state?.carts,
                    [cartId]: { ...cart, total_amount, total_cost, items },
                },
            }
        }
        return state
    }

    static addToCart({ state, payload }: ReducerArgs) {
        // recieves productId, unitId, quantity, conversion_factor
        const cartId = state?.activeCartId
        const cart = state?.carts[cartId]
        let items = [...cart.items]

        let total_cost = cart?.total_cost ?? 0
        let total_amount = cart?.total_amount ?? 0

        if (cart) {
            const existing = items.find(
                (item) =>
                    item.product_id === payload?.product_id &&
                    item.unit_id === payload?.unit_id
            )
            if (existing) {
                const quantity = parseInt(payload?.quantity)
                const normalizedQuantity =
                    parseInt(payload?.conversion_factor) *
                    parseInt(payload?.quantity)

                items = items.map((item) => {
                    if (
                        item.product_id === payload?.product_id &&
                        item.unit_id === payload?.unit_id
                    ) {
                        total_amount += quantity * item?.selling_price
                        total_cost += quantity * item?.cost_price
                        return {
                            ...item,
                            quantity: item.quantity + quantity,
                            normalized_quantity: normalizedQuantity,
                        }
                    }

                    return item
                })
                return {
                    ...state,
                    carts: {
                        ...state?.carts,
                        [cartId]: {
                            ...cart,
                            total_amount,
                            total_cost,
                            items,
                        },
                    },
                }
            } else {
                const quantity = parseInt(payload?.quantity)
                const normalizedQuantity =
                    parseInt(payload?.conversion_factor) *
                    parseInt(payload?.quantity)
                total_amount += quantity * payload?.selling_price
                total_cost += quantity * payload?.cost_price

                items.push({
                    product_id: payload?.product_id,
                    unit_id: payload?.unit_id,
                    quantity: quantity,
                    normalized_quantity: normalizedQuantity,
                    conversion_factor: parseInt(payload?.conversion_factor),
                    name: payload?.name,
                    cost_price: payload?.cost_price,
                    selling_price: payload?.selling_price,
                    stock_quantity: payload?.stock_quantity,
                    is_base_unit: payload?.is_base_unit,
                    unit_name: payload?.unit_name,
                })
                return {
                    ...state,
                    carts: {
                        ...state?.carts,
                        [cartId]: {
                            ...cart,
                            total_amount,
                            total_cost,
                            items,
                        },
                    },
                }
            }
        }
        return state
    }
}
