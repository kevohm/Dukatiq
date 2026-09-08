import {  UnitSyncRepository} from './unit.sync.repository.js'

export class UnitSyncService {
    static async pull(checkpoint, limit = 100) {
        return UnitSyncRepository.pull(checkpoint, limit)
    }

    static async push(docs) {
        return UnitSyncRepository.push(docs)
    }
}
