import { api } from '../../lib/utils'
import type {
    InventoryAdjustmentPayload,
    InventoryEvent,
    InventoryCreatePayload,
    ProductStockSummary,
} from './types'

export const inventoryApi = {
    getAll: () => api.get<InventoryEvent[]>('/inventory'),

    getStock: (productId: string) =>
        api.get<ProductStockSummary>(`/inventory/stock/${productId}`),

    stockIn: (data: InventoryCreatePayload) =>
        api.post<InventoryEvent>('/inventory/stock-in', data),

    stockOut: (data: InventoryCreatePayload) =>
        api.post<InventoryEvent>('/inventory/stock-out', data),

    adjust: (data: InventoryAdjustmentPayload) =>
        api.post<InventoryEvent>('/inventory/adjust', data),
}
