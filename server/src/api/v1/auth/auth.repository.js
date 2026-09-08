import { and, eq, gt, isNull } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { refreshTokens, users } from '../../../db/schema.js'
import { hashPassword } from '../../../utils/auth/password.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class AuthRepository {
    static async findById(id, client = db) {
        const row = await client.select().from(users).where(eq(users.id, id))
        return row[0] ?? null
    }
    static async findByEmail(email, client = db) {
        const [user] = await client
            .select()
            .from(users)
            .where(eq(users.email, email))
        return user
    }
    static async create(data, client = db) {
        const password = await hashPassword(data.password)
        const [user] = await client
            .insert(users)
            .values({ ...data, password })
            .returning()
        return user
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.findByEmail(data.email, client)) ??
            this.create(data, client)
        )
    }
    static async update(id, data, client = db) {
        await client
            .update(users)
            .set({ ...data, updated_at: new Date() })
            .where(eq(users.id, id))
        return this.findById(id, client)
    }
    static async delete(id, client = db) {
        const deleted = await client
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id })
        if (!deleted.length)
            throw new AppError({
                message: 'Failed to delete user',
                code: ERROR_CODES.AUTH.INVALID_REFRESH_TOKEN,
                status: 500,
                meta: { resource: 'auth', id },
            })
        return deleted[0]
    }
    static async saveRefreshToken(data, client = db) {
        const [token] = await client
            .insert(refreshTokens)
            .values({ ...data, revoked_at: null })
            .returning()
        return token
    }
    static async findValidTokens(client = db) {
        return client
            .select()
            .from(refreshTokens)
            .where(
                and(
                    isNull(refreshTokens.revoked_at),
                    gt(refreshTokens.expires_at, new Date())
                )
            )
    }
    static async findActiveTokenById(id, client = db) {
        const [token] = await client
            .select()
            .from(refreshTokens)
            .where(
                and(
                    eq(refreshTokens.id, id),
                    isNull(refreshTokens.revoked_at),
                    gt(refreshTokens.expires_at, new Date())
                )
            )
        return token ?? null
    }
    static async revokeToken(id, client = db) {
        return client
            .update(refreshTokens)
            .set({ revoked_at: new Date(), updated_at: new Date() })
            .where(eq(refreshTokens.id, id))
            .returning()
    }
}
