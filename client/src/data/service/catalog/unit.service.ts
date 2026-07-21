import { getRepositories } from '../../repositories'
import type {
    IUnitCreatePayload,
    IUnitUpdatePayload,
} from '@/features/product/unit/types'

export class UnitService {
    async getAll() {
        const { unitRepository } = await getRepositories()
        return unitRepository.findAll()
    }
    async getById(id?: string) {
        const { unitRepository } = await getRepositories()
        if (!id) {
            throw new Error('Unit does not exist')
        }
        return unitRepository.findOrThrow(id, 'Product unit does not exist')
    }

    async create(payload: IUnitCreatePayload) {
        const { unitRepository } = await getRepositories()
        return await unitRepository.findOrCreate(payload?.name)
    }

    async update(id: string, payload: IUnitUpdatePayload) {
        const { unitRepository } = await getRepositories()
        const unit = await unitRepository.findOrThrow(id)
        let existing = null
        if (payload?.name) {
            existing = await unitRepository.findByName(payload?.name)
        }
        if (existing?.name === payload?.name || unit?.name === payload?.name) {
            throw new Error(
                `A unit with the name "${payload.name}" already exists`
            )
        }
        return unitRepository.update(id, payload)
    }

    async delete(id: string) {
        const { unitRepository } = await getRepositories()
        await unitRepository.findOrThrow(id)
        return unitRepository.delete(id)
    }
}
