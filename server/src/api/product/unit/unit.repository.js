import { Unit } from './unit.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class UnitRepository {
    static async getAll() {
        return Unit.findAll()
    }

    static async getById(id) {
        const unit = await Unit.findByPk(id)
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

    static async getByName(name, transaction = null) {
        return Unit.findOne({ where: { name }, transaction })
    }

    static async create(data, transaction = null) {
        return Unit.create(data, { transaction })
    }

    static async findOrCreate(data, transaction = null) {
        const unit = await this.getByName(data.name, transaction)
        if (!unit) {
            return this.create(data, transaction)
        }
        return unit
    }

    static async delete(id) {
        const deleted = await Unit.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete unit',
                code: ERROR_CODES.UNIT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'unit', id },
            })
        }
        return deleted
    }
}
