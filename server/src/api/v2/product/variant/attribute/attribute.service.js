import { StatusCodes } from 'http-status-codes'
import { AttributeRepository } from './attribute.repository.js'
import { AttributeValidator } from './attribute.validator.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'

export class AttributeService {
    static async findMany() {
        const data = await AttributeRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Attributes found',
        }
    }

    static async findById(id) {
        const attribute = await AttributeRepository.getById(id)
        if (!attribute) {
            throw new AppError({
                message: 'Attribute not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'attribute', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: attribute,
            message: 'Attribute found',
        }
    }
    static async add(body) {
        const data =
            await AttributeValidator.createSchema.parseAsync(body)
        const existingCat = await AttributeRepository.getByName(
            data?.name
        )
        if (existingCat) {
            throw new AppError({
                message: 'Attribute already exists',
                code: ERROR_CODES.ATTRIBUTE.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'attribute', name: data?.name },
            })
        }
        const attribute = await AttributeRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: attribute,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const attribute = await this.findById(id)

        const data =
            await AttributeValidator.updateSchema.parseAsync(body)

        const result = await AttributeRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update attribute',
                code: ERROR_CODES.ATTRIBUTE.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'attribute', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: attribute,
            message: 'Attribute updated',
        }
    }

    static async remove(id) {
        const attribute = await this.findById(id)
        await AttributeRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: attribute,
            message: 'Attribute deleted',
        }
    }
}
