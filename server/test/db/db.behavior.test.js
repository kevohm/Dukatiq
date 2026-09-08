import { describe, it, expect } from 'vitest'
import { db } from '../../src/config/database.js'
import { hashPassword } from '../../src/utils/auth/password.js'
import { users } from '../../src/db/schema.js'

describe('DB isolation', () => {
    it('should NOT persist data between tests', async () => {
      const password = await hashPassword('Kevin')
        await db.insert(users, "email", "first_name","last_name","password").values({
            email: 'persist@test.com',
            first_name: 'Kevin',
            last_name: 'Kibet',
            password
        })

        const data = await db.select().from(users);
        expect(data.length).toBe(1)
    })

    it('should start fresh DB', async () => {
        const data = await db.select().from(users)

        // 🔥 This should be ZERO if memory DB + reset works
        expect(data.length).toBe(0)
    })
})
