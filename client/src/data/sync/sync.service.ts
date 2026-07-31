import { getDatabase } from '../db'
import { startCatalogSync } from './replication/catalog/catalog.sync'
import { replicateProducts } from './replication/catalog/products'
import { replicateInventory } from './replication/inventory/inventory'
import { replicateSale } from './replication/sale/sale'
import { replicateSaleItem } from './replication/sale/sale.item'

export class SyncService {
    private started = false

    async start() {
        if (this.started) return
        const db = await getDatabase()
        await Promise.all([
            startCatalogSync(),
            replicateInventory(db),
            replicateProducts(db),

            replicateSale(db),
            replicateSaleItem(db),
        ])

        this.started = true
    }
}
