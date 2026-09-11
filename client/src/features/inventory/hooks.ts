import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from '@/data/service/inventory/inventory.service'

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

export function useInventory(query={}) {
    return useQuery({
        queryKey: [...INVENTORY_KEY, query],
        queryFn: ()=>inventoryService.getAll(query),
    })
}

export function useProductStock(productId?: string) {
    return useQuery({
        queryKey: ['inventory', 'stock', productId],
        queryFn: () => inventoryService.getStock(productId!),
        enabled: Boolean(productId),
    })
}

export function useStockIn() {
    return useInventoryMutation(inventoryService.stockIn)
}

export function useStockOut() {
    return useInventoryMutation(inventoryService.stockOut)
}

export function useAdjustStock() {
    return useInventoryMutation(inventoryService.adjust)
}
