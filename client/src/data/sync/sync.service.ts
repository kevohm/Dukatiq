import { startCatalogSync } from './replication/catalog/catalog.sync'

export class SyncService {
    private started = false

    async start() {
        if (this.started) return

        await Promise.all([startCatalogSync()])

        this.started = true
    }
}
