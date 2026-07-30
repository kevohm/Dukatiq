import type {
    ILocalAccessPayload,
    IVerifyLocalAccessPayload,
} from '@/features/auth/types.js'
import { getRepositories } from '../../repositories/index.js'
import type { LocalAccessRepository } from '../../repositories/sessions/local.access.repository.js'
import { BaseService } from '../base.service.js'
import { hashPassword, verifyPassword } from '@/utils/password.js'
import { localSessionService, userService } from '../index.js'

/**
 * provides offline authentication and verification albeit dependant on previous login session
 */
export class LocalAccessService extends BaseService<LocalAccessRepository> {
    private cause = 'offline access'
    constructor() {
        super(async () => {
            const { localAccessRepository } = await getRepositories()
            return localAccessRepository
        })
    }

    async setLocalAccess(data: ILocalAccessPayload) {
        const { localAccessRepository } = await getRepositories()
        const repository = localAccessRepository
        // 1. Hash password using PBKDF2
        const { password_hash, password_salt, iterations } = await hashPassword(
            data.password
        )

        // console.log(data, password_hash, password_salt, iterations)
        const activeUser = await userService.getActiveUser()

        if (!activeUser)
            throw new Error('Invalid Session', {
                cause: 'local offline access',
            })

        const existing = await repository.findByUserId(activeUser?.id)

        if (existing) {
            return repository.update(existing.id, {
                password: password_hash,
                salt: password_salt,
                iterations: iterations,
            })
        }

        return repository.create({
            user_id: activeUser?.id,
            password: password_hash,
            salt: password_salt,
            iterations: iterations,
        })
    }

    async verifyLocalAccess(data: IVerifyLocalAccessPayload) {
        const { localAccessRepository } = await getRepositories()
        const repository = localAccessRepository
        const activeUser = await userService.getActiveUserSecurely({
            error: 'Invalid credentials',
            cause: this.cause,
        })
        const userId = activeUser?.id
        const localAccess = await repository.findByUserId(userId)

        if (!localAccess) {
            throw new Error('Invalid credentials', {
                cause: 'offline session',
            })
        }

        // 1. Run constant-time verification using stored hash, salt, and iterations
        const valid = await verifyPassword(
            data.password,
            localAccess.password,
            localAccess.salt,
            localAccess.iterations
        )

        if (!valid) {
            throw new Error('Invalid credentials')
        }

        // 2. Automatically grant an offline local session (e.g., valid for 7 days)
        const session = await localSessionService.createSession({
            user_id: userId,
        })

        return {
            user_id: userId,
            verified: true,
            session,
        }
    }

    async checkForUserLocalAccess() {
        const { localAccessRepository } = await getRepositories()
        const activeUser = await userService.getActiveUser()

        if (!activeUser) return false

        const userId = activeUser?.id

        const localAccess = await localAccessRepository.findByUserId(userId)

        if (!localAccess) {
            return false
        }

        return true
    }
}
