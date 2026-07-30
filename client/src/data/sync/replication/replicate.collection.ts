import { replicateRxCollection } from 'rxdb/plugins/replication'
import type { RxCollection } from 'rxdb'
import { syncApi } from '../api'
import { baseConfig } from '../config'

interface ReplicationConfig {
    collection: RxCollection
    name: string
}

export function replicateCollection({ collection, name }: ReplicationConfig) {
    return replicateRxCollection({
        collection,

        replicationIdentifier: `catalog/${name}`,
        ...baseConfig,

        deletedField:"is_deleted",

        push: {
            batchSize: 50,

            handler(docs) {
                return syncApi.push(name, docs)
            },

            modifier(doc) {
                return doc
            },
            
        },

        pull: {
            batchSize: 100,

            handler(checkpoint, batchSize) {
                return syncApi.pull(name, checkpoint, batchSize)
            },

            modifier(doc) {
                return doc
            },
        },
    })
}
