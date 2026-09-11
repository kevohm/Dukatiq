import { StatusCodes } from 'http-status-codes'
import { AttributeValueRepository } from './attribute.value.repository.js'
import { AttributeValueValidator } from './attribute.value.validator.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'
import { AttributeRepository } from '../attribute/attribute.repository.js'
import { AttributeService } from '../attribute/attribute.service.js'

export class AttributeValueService {
    static async findMany() {
        const data = await AttributeValueRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Attribute values found',
        }
    }

    static async findById(id) {
        const attribute = await AttributeValueRepository.getById(id)
        if (!attribute) {
            throw new AppError({
                message: 'Attribute value not found',
                code: ERROR_CODES.ATTRIBUTE_VALUE.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'attribute-value', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: attribute,
            message: 'Attribute value found',
        }
    }
    static async add(body) {
        const data = await AttributeValueValidator.createSchema.parseAsync(body)
        await AttributeService.findById(data.attribute_id)
        const existing = await AttributeValueRepository.getByValue(
            data.value,
            data.attribute_id
        )
        if (existing) {
            throw new AppError({
                message: 'Attribute value already exists',
                code: ERROR_CODES.ATTRIBUTE.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: {
                    resource: 'attribute-value',
                    value: data?.value,
                    attribute_id: data.attribute_id,
                },
            })
        }
        const attribute = await AttributeValueRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: attribute,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const attribute = await this.findById(id)

        const data = await AttributeValueValidator.updateSchema.parseAsync(body)

        const result = await AttributeValueRepository.update(id, data)
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
            message: 'AttributeValue updated',
        }
    }

    static async remove(id) {
        const attribute = await this.findById(id)
        await AttributeValueRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: attribute,
            message: 'AttributeValue deleted',
        }
    }
}
