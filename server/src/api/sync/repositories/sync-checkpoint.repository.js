import { eq } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { syncCheckpoints } from '../../../db/schema.js'

export class SyncCheckpointRepository {
    static async get(collection) {
        const result = await db
            .select()
            .from(syncCheckpoints)
            .where(eq(syncCheckpoints.collection, collection))
            .limit(1)

        if (!result.length) return null

        return {
            id: result[0].last_synced_id,
            updatedAt: result[0].last_synced_at,
        }
    }

    static async save(collection, checkpoint) {
        await db
            .insert(syncCheckpoints)
            .values({
                collection,
                last_synced_at: checkpoint.updatedAt,
                last_synced_id: checkpoint.id,
            })
            .onConflictDoUpdate({
                target: syncCheckpoints.collection,
                set: {
                    last_synced_at: checkpoint.updatedAt,
                    last_synced_id: checkpoint.id,
                },
            })
    }
}
