import { eq, or, gt, and, asc } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { SyncCheckpointService } from '../repositories/sync-checkpoint.service.js'

export function createSyncRepository({
    table,
    collection,
    primaryKey = 'id',
    // Pass columns that define unique constraints (e.g. ['name'] or ['product_id', 'unit_id'])
    uniqueKeys = [],
    beforePush=()=>null,
    afterPush,
}) {
    // Helper to build unique lookup queries dynamically
    function buildUniqueCondition(doc) {
        const conditions = []

        // 1. Primary key condition
        if (doc[primaryKey]) {
            conditions.push(eq(table[primaryKey], doc[primaryKey]))
        }

        // 2. Natural composite / unique key conditions
        if (uniqueKeys.length > 0) {
            const matchAllKeys = uniqueKeys
                .filter((key) => doc[key] !== undefined)
                .map((key) => eq(table[key], doc[key]))

            if (matchAllKeys.length === uniqueKeys.length) {
                // All unique key fields are present in the doc
                conditions.push(and(...matchAllKeys))
            }
        }

        // If either PK matches OR the composite unique keys match, it's the same record!
        return or(...conditions)
    }

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
                            gt(table[primaryKey], currentCheckpoint.id)
                        )
                    )
                )
            }

            const documents = await query
                .orderBy(asc(table.updated_at), asc(table[primaryKey]))
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

            await db.transaction(async (tx) => {
                for (const docState of docs) {
                    let doc = docState.newDocumentState
                    if (!doc) continue

                    // tranform data
                    if (beforePush) {
                        const newDoc = await beforePush(tx, doc)
                        doc = newDoc ?? doc
                    }

                    const condition = buildUniqueCondition(doc)

                    // Search DB using PK OR Unique composite key
                    const existing = await tx
                        .select()
                        .from(table)
                        .where(condition)
                        .limit(1)

                    const current = existing[0]

                    // Scenario 1: Brand new record -> Safe to INSERT
                    if (!current) {
                        await tx.insert(table).values({
                            ...doc,
                            updated_at: new Date(doc.updated_at || Date.now()),
                        })
                        continue
                    }

                    // Scenario 2: IDs match & Client timestamp is newer -> Standard UPDATE
                    if (current[primaryKey] === doc[primaryKey]) {
                        if (doc.is_deleted || doc._deleted) {
                            await tx
                                .update(table)
                                .set({
                                    is_deleted: true,
                                    updated_at: new Date(),
                                })
                                .where(eq(table[primaryKey], doc[primaryKey]))
                        } else {
                            await tx
                                .update(table)
                                .set({
                                    ...doc,
                                    updated_at: new Date(),
                                })
                                .where(eq(table[primaryKey], doc[primaryKey]))
                        }
                        continue
                    }

                    // Scenario 3: Unique key match (e.g., duplicate 'name' or duplicate 'product_id + unit_id'),
                    // but Primary Keys differ!
                    // This is a Natural Conflict -> Return server state so RxDB handles it cleanly.
                    if (afterPush) {
                       await afterPush(tx, doc)
                    }
                    conflicts.push(current)
                }
            })

            return conflicts
        },
    }
}
