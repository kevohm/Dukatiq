import type { IOCreateUserPayload } from '@/features/auth/types.js'
import { getRepositories } from '../../repositories/index.js'
import { UserRepository } from '../../repositories/sessions/user.repository.js'
import { BaseService } from '../base.service.js'

/**
 * Saves users logged in to this machine
 * It is not synced to db to ensure a single source of truth
 * id should be actual userId in this case
 *
 */
export class UserService extends BaseService<UserRepository> {
    private cause = 'user'
    constructor() {
        super(async () => {
            const { userRepository } = await getRepositories()
            return userRepository
        })
    }

    async createOrFind(payload: IOCreateUserPayload) {
        const repository = await this.getRepository()
        return repository.createOrFind(payload)
    }

    async getActiveUser() {
        const { userRepository } = await getRepositories()
        const repository = userRepository
        return repository.findActiveUser()
    }
    async getActiveUserSecurely({
        error = 'Invalid session',
        cause = this.cause,
    }) {
        const { userRepository } = await getRepositories()
        const repository = userRepository
        const user = await repository.findActiveUser()
        if (!user) {
            throw new Error(error, {
                cause,
            })
        }
        return user
    }

    async deleteActiveUser() {
        const repository = await this.getRepository()
        return repository.removeActiveUser()
    }

    async deleteActiveUsers() {
        const repository = await this.getRepository()
        return repository.removeActiveUsers()
    }
}
