import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from './api'

const INVENTORY_KEY = ['inventory']

function useInventoryMutation<T>(mutationFn: (data: T) => Promise<unknown>) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVENTORY_KEY })
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useInventory() {
    return useQuery({
        queryKey: INVENTORY_KEY,
        queryFn: inventoryApi.getAll,
    })
}

export function useProductStock(productId?: string) {
    return useQuery({
        queryKey: ['inventory', 'stock', productId],
        queryFn: () => inventoryApi.getStock(productId!),
        enabled: Boolean(productId),
    })
}

export function useStockIn() {
    return useInventoryMutation(inventoryApi.stockIn)
}

export function useStockOut() {
    return useInventoryMutation(inventoryApi.stockOut)
}

export function useAdjustStock() {
    return useInventoryMutation(inventoryApi.adjust)
}
