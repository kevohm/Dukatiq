import { getRepositories } from '../../repositories/index.js'
import type { LocalSessionRepository } from '../../repositories/sessions/local.session.repository.js'
import { BaseService } from '../base.service.js'
import { userService } from '../index.js'

export interface CreateLocalSessionPayload {
    user_id: string
    expires_in_days?: number
}
/**
 * tracks session in a device for offline functionality
 */
export class LocalSessionService extends BaseService<LocalSessionRepository> {
    // Default session duration: 7 days
    private static DEFAULT_SESSION_DAYS = 7
    //@ts-ignore
    private cause = 'offline session'

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

        
        const existing = await repository.findByUserId(data.user_id)
        
        let nowIso = new Date().toISOString()
        // console.log(expiresAtIso, nowIso)
        if (existing) {
            return repository
                .update(existing.id, {
                    last_verified_at: nowIso,
                })
                ?.then((item) => item?.toJSON())
        }

        nowIso = new Date().toISOString()
        const expiresAtIso = this.calculateExpiration(data.expires_in_days)

        return repository
            .create({
                user_id: data.user_id,
                last_verified_at: nowIso,
                expires_at: expiresAtIso,
            })
            ?.then((item) => item?.toJSON())
    }

    async getSession(userId: string) {
        const repository = await this.getRepository()
        const session = await repository.findByUserId(userId)

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

    async hasSessionExpired() {
        const repository = await this.getRepository()
        const activeUser = await userService.getActiveUser()
        if (!activeUser) {
            return true
        }

        const session = await repository.findByUserId(activeUser?.id)

        if (!session) {
            return true
        }

        const hasSessionExpired = new Date(session.expires_at) < new Date()

        if (hasSessionExpired) {
            return true
        }

        const requiresReverification =
            new Date().getTime() -
                new Date(session?.last_verified_at).getTime() >
            6 * 60 * 60 * 1000

        if (requiresReverification) {
            return true
        }

        return false
    }

    async deleteSession(userId: string) {
        const repository = await this.getRepository()

        return repository.deleteByUserId(userId)
    }
    /**
     * finds active user and fetches their active session
     * @returns  session {@type DeepReadonlyObject<LocalSessionDoc>}
     */
    async getActiveSession() {
        const activeUser = await userService.getActiveUser()
        const storedUserId = activeUser?.id

        if (!storedUserId)
            throw Error('Invalid offline session', {
                cause: 'offline session service',
            })

        return await this.getSession(storedUserId)
    }
    /**
     * finds active user and deletes their session
     * @returns void
     */
    async deleteActiveSession() {
        const repository = await this.getRepository()
        const activeUser = await userService.getActiveUser()
        if (!activeUser)
            throw new Error('Invalid session', {
                cause: 'offline session service',
            })
        await repository.deleteByUserId(activeUser?.id)

        // required and only removed on logout acts as pesistence for offline login
        // await userService.deleteActiveUser()
    }
}
