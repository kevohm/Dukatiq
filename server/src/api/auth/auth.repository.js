
import { db } from '../../config/database.js'
import { User } from '../../entities/user/user.model.js'
import {RefreshToken} from "../../entities/user/refresh.model.js"
import { hashPassword } from '../../utils/auth/password.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

export class AuthRepository {
    static userRepo = db.getRepository(User)
    static refreshTokenRepo = db.getRepository(RefreshToken)

    // -----------------------------
    // GET USER BY ID
    // -----------------------------
    static async findById(
        id,
        manager = this.userRepo.manager
    ) {
        return manager.findOne(User, {
            where: { id },
        })
    }

    // -----------------------------
    // GET USER BY EMAIL
    // -----------------------------
    static async findByEmail(
        email,
        manager = this.userRepo.manager
    ) {
        return manager.findOne(User, {
            where: { email },
        })
    }

    // -----------------------------
    // CREATE USER
    // -----------------------------
    static async create(
        data,
        manager = this.userRepo.manager
    ) {
        const password = await hashPassword(data.password)

        const user = manager.create(User, {
            ...data,
            password,
        })

        return manager.save(user)
    }

    // -----------------------------
    // FIND OR CREATE USER
    // -----------------------------
    static async findOrCreate(
        data,
        manager = this.userRepo.manager
    ) {
        const user = await this.findByEmail(data.email, manager)

        if (!user) {
            return this.create(data, manager)
        }

        return user
    }

    // -----------------------------
    // UPDATE USER
    // -----------------------------
    static async update(
        id,
        data,
        manager = this.userRepo.manager
    ) {
        await manager.update(User, id, data)
        return this.findById(id, manager)
    }

    // -----------------------------
    // DELETE USER
    // -----------------------------
    static async delete(
        id,
        manager = this.userRepo.manager
    ) {
        const result = await manager.delete(User, id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete user',
                code: ERROR_CODES.AUTH.INVALID_REFRESH_TOKEN,
                status: 500,
                meta: {
                    resource: 'auth',
                    id,
                },
            })
        }

        return result
    }

    // -----------------------------
    // SAVE REFRESH TOKEN
    // -----------------------------
    static async saveRefreshToken(
        data,
        manager = this.refreshTokenRepo.manager
    ) {
        const token = manager.create(RefreshToken, {
            ...data,
            revoked_at: null,
        })

        return manager.save(token)
    }

    // -----------------------------
    // FIND ALL VALID TOKENS
    // -----------------------------
    static async findValidTokens(
        manager = this.refreshTokenRepo.manager
    ) {
        return manager.find(RefreshToken, {
            where: {
                revoked_at: null,
                expires_at: MoreThan(new Date()),
            },
        })
    }

    // -----------------------------
    // FIND ACTIVE TOKEN
    // -----------------------------
    static async findActiveTokenById(
        id,
        manager = this.refreshTokenRepo.manager
    ) {
        return manager.findOne(RefreshToken, {
            where: {
                id,
                revoked_at: null,
                expires_at: MoreThan(new Date()),
            },
        })
    }

    // -----------------------------
    // REVOKE TOKEN
    // -----------------------------
    static async revokeToken(
        id,
        manager = this.refreshTokenRepo.manager
    ) {
        return manager.update(
            RefreshToken,
            { id },
            {
                revoked_at: new Date(),
            }
        )
    }
}