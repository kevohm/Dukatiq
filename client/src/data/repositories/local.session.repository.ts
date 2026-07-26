import type { LocalSessionDoc } from '../models/local-session'
import { BaseRepository } from './base.repository'

export class LocalSessionRepository extends BaseRepository<LocalSessionDoc> {
    async findByUserId(user_id: string) {
        return this.collection
            .findOne({
                selector: {
                    user_id,
                },
            })
            .exec()
    }

    async deleteByUserId(user_id: string) {
        const session = await this.findByUserId(user_id)

        if (!session) {
            return null
        }

        return session.remove()
    }

    async clearExpiredSessions() {
        const sessions = await this.collection.find().exec()

        const now = new Date()

        const expired = sessions.filter(
            (session) => new Date(session.expires_at) < now
        )

        await Promise.all(expired.map((session) => session.remove()))

        return expired.length
    }
}
