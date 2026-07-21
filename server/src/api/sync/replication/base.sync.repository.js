import { eq, or, gt, and, asc } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { syncCheckpoints } from '../../../db/schema.js'
import { SyncCheckpointRepository } from '../repositories/sync-checkpoint.repository.js'
import { SyncCheckpointService } from '../repositories/sync-checkpoint.service.js'
import { SyncCollections } from '../sync.collections.js'

export function createSyncRepository({
    table,
    collection,
    uniqueField = 'name',
}) {
    return {
        async pull(checkpoint, limit = 100) {
            const currentCheckpoint = await SyncCheckpointService.resolve(
                collection,
                checkpoint
            )

            let query = db.select().from(table)

            if (currentCheckpoint) {
                query = query.where(
                    or(
                        gt(
                            table.updated_at,
                            new Date(currentCheckpoint.updatedAt)
                        ),
                        and(
                            eq(
                                table.updated_at,
                                new Date(currentCheckpoint.updatedAt)
                            ),
                            gt(table.id, currentCheckpoint.id)
                        )
                    )
                )
            }

            const documents = await query
                .orderBy(asc(table.updated_at), asc(table.id))
                .limit(limit)

            const newCheckpoint = await SyncCheckpointService.update(
                collection,
                documents
            )

            return {
                documents,
                checkpoint: newCheckpoint ?? currentCheckpoint,
            }
        },

        async push(docs) {
            const conflicts = []

            for (const docState of docs) {
                const doc = docState.newDocumentState

                if (!doc) continue

                const existing = await db
                    .select()
                    .from(table)
                    .where(eq(table[uniqueField], doc[uniqueField]))
                    .limit(1)
      

                if (!existing.length) {
                    await db.insert(table).values(doc)
                    continue
                }

                const current = existing[0]

                if (current.id === doc.id) {
                    if (
                        new Date(doc.updated_at) > new Date(current.updated_at)
                    ) {
                        await db
                            .update(table)
                            .set(doc)
                            .where(eq(table.id, doc.id))
                    }

                    continue
                }

                conflicts.push({
                    assumedMasterState: current,
                    newDocumentState: doc,
                })
            }

            return conflicts
        },
    }
}
