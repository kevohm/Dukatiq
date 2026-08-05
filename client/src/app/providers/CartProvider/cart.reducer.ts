import { cartActions, type cartActionKey } from './cart.actions'
import type { CartStore } from './CartProvider'

export const MAX_CART_AT_A_TIME = 4

export const reducer = (
    state: CartStore,
    payload: Record<string, any> & {
        type: cartActionKey
    }
) => {
    const { type } = payload

    switch (payload?.type) {
        case cartActions.ADD_TO_CART: {
            // recieves productId, unitId, quantity, conversion_factor
            const cartId = state?.activeCartId
            const cart = state?.carts[cartId]
            let items = [...cart.items]

            if (cart) {
                const existing = items.find(
                    (item) =>
                        item.product_id === payload?.product_id &&
                        item.unit_id === payload?.unit_id
                )
                if (existing) {
                    const quantity =
                        existing?.conversion_factor *
                        parseInt(payload?.quantity)
                    items = items.map((item) =>
                        item.product_id === payload?.product_id &&
                        item.unit_id === payload?.unit_id
                            ? {
                                  ...item,
                                  quantity: item.quantity + quantity,
                              }
                            : item
                    )
                    return {
                        ...state,
                        carts: {
                            ...state?.carts,
                            [cartId]: {
                                ...cart,
                                items,
                            },
                        },
                    }
                } else {
                    const quantity =
                        parseInt(payload?.conversion_factor) *
                        parseInt(payload?.quantity)
                    items.push({
                        product_id: payload?.product_id,
                        unit_id: payload?.unit_id,
                        quantity: quantity,
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
                            [cartId]: { ...cart, items },
                        },
                    }
                }
            }
            return state
        }

        case cartActions.INCREASE_QUANTITY_IN_CART: {
            // recieves productId, unitId, quantity, conversion_rate
            const cartId = state?.activeCartId
            const cart = state?.carts[cartId]
            if (cart) {
                const items = cart?.items
                    .map((item) => {
                        const quantity =
                            parseInt(payload?.quantity) *
                            item?.conversion_factor
                        if (
                            item.product_id !== payload?.product_id ||
                            item.unit_id !== payload?.unit_id
                        ) {
                            return item
                        }

                        return {
                            ...item,
                            quantity: item.quantity + Math.abs(quantity),
                        }
                    })
                    .filter((item) => item.quantity > 0)

                return {
                    ...state,
                    carts: {
                        ...state?.carts,
                        [cartId]: { ...cart, items },
                    },
                }
            }
            return state
        }

        case cartActions.DECREASE_QUANTITY_IN_CART: {
            // recieves productId, unitId, quantity, conversion_rate
            const cartId = state?.activeCartId
            const cart = state?.carts[cartId]
            if (cart) {
                const items = cart?.items
                    .map((item) => {
                        const quantity =
                            parseInt(payload?.quantity) *
                            item?.conversion_factor

                        if (
                            item.product_id !== payload?.product_id ||
                            item.unit_id !== payload?.unit_id
                        ) {
                            return item
                        }

                        return {
                            ...item,
                            quantity: Math.max(
                                0,
                                item.quantity - Math.abs(quantity)
                            ),
                        }
                    })
                    .filter((item) => item.quantity > 0)

                return {
                    ...state,
                    carts: {
                        ...state?.carts,
                        [cartId]: { ...cart, items },
                    },
                }
            }
            return state
        }

        case cartActions.REMOVE_FROM_CART: {
            // recieves productId, unitId
            const cartId = state?.activeCartId
            const cart = state?.carts[cartId]
            if (!cart) {
                return state
            }

            return {
                ...state,
                carts: {
                    ...state?.carts,
                    [cartId]: {
                        ...cart,
                        items: cart?.items?.filter(
                            (item) =>
                                !(
                                    item.unit_id == payload.unit_id &&
                                    item.product_id == payload.product_id
                                )
                        ),
                    },
                },
            }
        }
        case cartActions.CLEAR_CART: {
            // recieves cartId
            const cartId = state?.activeCartId
            const cart = state?.carts[cartId]
            if (cart) {
                return {
                    ...state,
                    carts: {
                        ...state?.carts,
                        [cartId]: { ...cart, items: [] },
                    },
                }
            }
            return state
        }

        case cartActions.CHANGE_ACTIVE_CART: {
            // recieves cartId
            const cartId = payload?.cart_id
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

        case cartActions.ADD_NEW_CART: {
            if (Object.keys(state.carts)?.length >= MAX_CART_AT_A_TIME) {
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

    
        default:
            throw new Error(`Invalid state ${type}`)
    }
}
