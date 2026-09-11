import { SaleSyncRepository } from "./sale.repository.js"

export class SaleSyncService {
    static async pull(checkpoint, limit = 100) {
        return SaleSyncRepository.pull(checkpoint, limit)
    }
    static async push(docs) {
        return SaleSyncRepository.push(docs)
    }

    
}
