import { db } from '../../../config/database.js'
import { Unit } from '../../../entities/product/unit.model.js'

import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class UnitRepository {
    static repo = db.getRepository(Unit)

    static async getAll() {
        return this.repo.find()
    }

    static async getById(id) {
        const unit = await this.repo.findOne({
            where: { id },
        })

        if (!unit) {
            throw new AppError({
                message: 'Unit not found',
                code: ERROR_CODES.UNIT.NOT_FOUND,
                status: 404,
                meta: { resource: 'unit', id },
            })
        }

        return unit
    }

    static async getByName(name, manager = this.repo.manager) {
        return manager.findOne(Unit,{
            where: { name },
        })
    }

    static async create(data, manager = this.repo.manager) {
        const unit = manager.create(Unit, data)
        return manager.save(Unit, unit)
    }

    static async findOrCreate(data, manager = this.repo.manager) {
        const unit = await this.getByName(data.name, manager)

        if (!unit) {
            return this.create(data, manager)
        }

        return unit
    }

    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete unit',
                code: ERROR_CODES.UNIT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'unit', id },
            })
        }

        return result
    }
}
