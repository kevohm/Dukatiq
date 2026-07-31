import { replicateRxCollection } from 'rxdb/plugins/replication'
import type { RxCollection, RxReplicationWriteToMasterRow } from 'rxdb'
import { syncApi } from '../api'
import { baseConfig } from '../config'

interface ReplicationConfig<T> {
    collection: RxCollection
    name: string
    beforePush?: (
        docs: RxReplicationWriteToMasterRow<T>[]
    ) => Promise<RxReplicationWriteToMasterRow<T>[]>
}

export function replicateCollection<T=unknown, CheckpointType=unknown>({
    collection,
    name,
    beforePush,
}: ReplicationConfig<T>) {
    return replicateRxCollection<T, CheckpointType>({
        collection,

        replicationIdentifier: `catalog/${name}`,
        ...baseConfig,

        deletedField: 'is_deleted',

        push: {
            batchSize: 50,

            async handler(docs) {
                let transformed = docs
                if (beforePush) {
                    transformed = await beforePush(docs)
                }
                return syncApi.push(name, transformed)
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
