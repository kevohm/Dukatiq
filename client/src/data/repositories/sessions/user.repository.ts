import type { IOCreateUserPayload } from '@/features/auth/types'
import { type UserDoc } from '../../models/sessions/user'
import { BaseRepository } from '../base.repository'

export class UserRepository extends BaseRepository<UserDoc> {
    async createOrFind(payload: IOCreateUserPayload) {
        const { created_at, updated_at } = this.generate()
        const existing = await this.findById(payload?.id)

        if (existing) {
            // to use updated at to track last login time
            await this.promoteToActiveUser(payload?.id)
            return existing
        }

        return this.collection.insert({
            id: payload?.id,
            email: payload?.email,
            full_name: payload?.full_name,
            is_active: payload.is_active,
            created_at,
            updated_at,
        })
    }

    async promoteToActiveUser(userId: string) {
        await this.removeActiveUsers()
        return await this.update(userId, { is_active: true })
    }

    async findActiveUser() {
        return await this.collection
            .findOne({ selector: { is_active: true } })
            .exec()
            .then((item) => item?.toJSON())
    }
    async removeActiveUser() {
        const activeUser = await this.findActiveUser()
        if(!activeUser) return null
        return this.update(activeUser?.id, {is_active:false})
    }

    async removeActiveUsers() {
        const activeUsers = await this.collection
            .find({
                selector: {
                    is_active: true,
                },
            })
            .exec()
        const updatedUsers = activeUsers?.map((u) => ({
            ...u?.toJSON(),
            is_active: false,
        }))
        return this.bulkUpsert(updatedUsers)
    }
}
