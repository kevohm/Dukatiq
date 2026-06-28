import { hashToken, verifyToken } from '../../../src/utils/auth/crypto.js'
import { AuthRepository } from '../../../src/api/auth/auth.repository.js'

async function generateToken(token = 'sample-refresh-token') {
    const token_hash = await hashToken(token)
    return { rawToken: token, token_hash }
}

async function createUser() {
    return await AuthRepository.create({
        email: `user-${Date.now()}@test.com`,
        first_name: 'Test',
        last_name: 'User',
        password: 'Password123',
    })
}

describe('RefreshToken', () => {
    it('should create token with expiry', async () => {
        const user = await createUser()

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

        const tokenSample = await generateToken('sample-refresh-token')

        const token = await AuthRepository.saveRefreshToken({
            ...tokenSample,
            user_id: user.id,
            expires_at: expiresAt,
            user_agent: 'jest',
            ip: '127.0.0.1',
        })
        const isValid = await verifyToken(
            token.token_hash,
            'sample-refresh-token'
        )

        expect(token).toBeDefined()
        expect(token.token_hash).toBeDefined() // ✅ correct
        expect(token.expires_at > new Date()).toBe(true)
        expect(token.revoked_at).toBeNull()
        expect(isValid).toBe(true)
    })
    it('should revoke token', async () => {
        const user = await createUser()

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

        const tokenSample = await generateToken('revoke-token')

        const token = await AuthRepository.saveRefreshToken({
            ...tokenSample,
            user_id: user.id,
            expires_at: expiresAt,
        })

        await AuthRepository.revokeToken(token.id)

        const revoked = await AuthRepository.findActiveTokenById(token.id)

        expect(revoked).toBeNull() // ✅ correct behavior
    })

    it('should not allow expired token usage', async () => {
        const user = await createUser()

        const expiredDate = new Date(Date.now() - 1000 * 60)

        const tokenSample = await generateToken('expired-token')

        await AuthRepository.saveRefreshToken({
            ...tokenSample,
            user_id: user.id,
            expires_at: expiredDate,
        })

        const validTokens = await AuthRepository.findValidTokens()

        const found = validTokens.find((t) => t.user_id === user.id)

        expect(found).toBeUndefined()
    })
})
