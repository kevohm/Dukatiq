import { StatusCodes } from 'http-status-codes'
import { UnitRepository } from './unit.repository.js'
import { UnitValidator } from './unit.validator.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class UnitService {
    static async findMany() {
        const data = await UnitRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Units found',
        }
    }

    static async findById(id) {
        const unit = await UnitRepository.getById(id)
        if (!unit) {
            throw new AppError({
                message: 'Unit not found',
                code: ERROR_CODES.UNIT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'unit', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: unit,
            message: 'Unit found',
        }
    }
    static async add(body) {
        const data = await UnitValidator.createSchema.parseAsync(body)

        const unit = await UnitRepository.findOrCreate(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: unit,
            message: 'Successfully added',
        }
    }

    static async remove(id) {
        const unit = await this.findById(id)
        await UnitRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: unit,
            message: 'Unit deleted',
        }
    }
}
