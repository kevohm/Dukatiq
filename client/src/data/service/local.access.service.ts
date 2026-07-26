import type {
    IOLocalAccessPayload,
    IVerifyLocalAccessPayload,
} from '@/features/auth/types.js'
import { getRepositories } from '../repositories/index.js'
import type { LocalAccessRepository } from '../repositories/local.access.repository.js'
import { BaseService } from './base.service.js'
import { hashPassword, verifyPassword } from '@/utils/password.js'
import { LocalSessionService } from './local.session.service.js'

export class LocalAccessService extends BaseService<LocalAccessRepository> {
    private sessionService: LocalSessionService

    constructor() {
        super(async () => {
            const { localAccessRepository } = await getRepositories()
            return localAccessRepository
        })
        this.sessionService = new LocalSessionService()
    }

    async setLocalAccess(data: IOLocalAccessPayload) {
        const repository = await this.getRepository()

        // 1. Hash password using PBKDF2
        const { password_hash, password_salt, iterations } = await hashPassword(
            data.password
        )

        // console.log(data, password_hash, password_salt, iterations)

        // 2. Format questions (Optionally hash answers if sensitive)
        const questions =
            data.questions?.map((q) => ({
                code: q?.code,
                question: q?.question,
                answer: q?.answer,
            })) ?? []

        const existing = await repository.findByUserId(data.user_id)

        if (existing) {
            return repository.update(existing.id, {
                password: password_hash,
                salt: password_salt,
                iterations: iterations,
                questions,
            })
        }

        return repository.create({
            user_id: data.user_id,
            password: password_hash,
            salt: password_salt,
            iterations: iterations,
            questions,
        })
    }

    async verifyLocalAccess(data: IVerifyLocalAccessPayload) {
        const {localAccessRepository} = await getRepositories()
        const repository = localAccessRepository

        const localAccess = await repository.findByUserId(data.user_id)

        if (!localAccess) {
            throw new Error('Local access has not been enabled')
        }

        // 1. Run constant-time verification using stored hash, salt, and iterations
        const valid = await verifyPassword(
            data.password,
            localAccess.password,
            localAccess.salt,
            localAccess.iterations
        )

        if (!valid) {
            throw new Error('Invalid local access password')
        }

        // 2. Automatically grant an offline local session (e.g., valid for 7 days)
        const session = await this.sessionService.createSession({
            user_id: data.user_id
        })

        return {
            user_id: data.user_id,
            verified: true,
            session,
        }
    }
}
