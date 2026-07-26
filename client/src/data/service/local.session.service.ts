import { getRepositories } from '../repositories/index.js'
import type { LocalSessionRepository } from '../repositories/local.session.repository.js'
import { BaseService } from './base.service.js'

export interface CreateLocalSessionPayload {
    user_id: string
    expires_in_days?: number
}

export class LocalSessionService extends BaseService<LocalSessionRepository> {
    // Default session duration: 7 days
    private static DEFAULT_SESSION_DAYS = 7

    constructor() {
        super(async () => {
            const { localSessionRepository } = await getRepositories()
            return localSessionRepository
        })
    }

    /**
     * Calculates the future expiration date string given a number of days from now.
     */
    private calculateExpiration(
        days: number = LocalSessionService.DEFAULT_SESSION_DAYS
    ): string {
        const now = new Date()
        now.setDate(now.getDate() + days)
        return now.toISOString()
    }

    async createSession(data: CreateLocalSessionPayload) {
        const repository = await this.getRepository()

        const nowIso = new Date().toISOString()
        const expiresAtIso = this.calculateExpiration(data.expires_in_days)

        const existing = await repository.findByUserId(data.user_id)

        if (existing) {
            return repository.update(existing.id, {
                last_verified_at: nowIso,
                expires_at: expiresAtIso,
            })
        }

        return repository.create({
            user_id: data.user_id,
            last_verified_at: nowIso,
            expires_at: expiresAtIso,
        })
    }

    async getSession(user_id: string) {
        const repository = await this.getRepository()
        const session = await repository.findByUserId(user_id)

        if (!session) {
            return null
        }

        // Clean up expired session
        if (new Date(session.expires_at) < new Date()) {
            await repository.delete(session.id)
            return null
        }

        return session
    }

    async deleteSession(user_id: string) {
        const repository = await this.getRepository()
        const session = await repository.findByUserId(user_id)

        if (!session) {
            return
        }

        return repository.delete(session.id)
    }
}
