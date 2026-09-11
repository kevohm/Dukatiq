import type { LocalSessionDoc } from '../../models/sessions/local-session'
import { BaseRepository } from '../base.repository'

export class LocalSessionRepository extends BaseRepository<LocalSessionDoc> {
    async findByUserId(userId: string) {
        return this.collection
            .findOne({
                selector: {
                    user_id: userId,
                },
            })
            .exec()
            .then((item) => item?.toJSON())
    }

    async deleteByUserId(userId: string) {
        const session = await this.findByUserId(userId)

        if (!session) {
            return null
        }
        return this.delete(session.id)
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
