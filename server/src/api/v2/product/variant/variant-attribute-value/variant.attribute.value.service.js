import { StatusCodes } from 'http-status-codes'
import { VariantAttributeValueRepository } from './variant.attribute.value.repository.js'
import { VariantAttributeValueValidator } from './variant.attribute.value.validator.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'
import { AttributeService } from '../attribute/attribute.service.js'
import { AttributeValueService } from '../attribute-value/attribute.value.service.js'
import { ProductVariantService } from '../product.variant.service.js'

export class VariantAttributeValueService {
    static async findByVariantIdAttributeValueId(body) {
        const variantAttributeValue =
            await this.findByVariantIdAttributeValueIdOrThrow(body)

        return {
            status: StatusCodes.OK,
            success: true,
            data: variantAttributeValue,
            message: 'Variant Attribute value found',
        }
    }

    static async findByVariantIdAttributeValueIdOrThrow(
        body,
        opts = {
            message: 'Variant attribute value not found',
            code: ERROR_CODES.VARIANT_ATTRIBUTE_VALUE.NOT_FOUND,
            status: StatusCodes.NOT_FOUND,
        }
    ) {
        const data =
            await VariantAttributeValueValidator.createSchema.parseAsync(body)

        const variantAttributeValue =
            await VariantAttributeValueRepository.getByVariantAttributeValue(
                data
            )
        if (!variantAttributeValue) {
            throw new AppError({
                ...opts,
                meta: {
                    resource: 'variant-attribute-value',
                    ...variantAttributeValue,
                },
            })
        }
        return variantAttributeValue
    }
    static async add(body) {
        const data =
            await VariantAttributeValueValidator.createSchema.parseAsync(body)
        await AttributeValueService.findById(data.attribute_value_id)
        await ProductVariantService.findById(data.variant_id)
        const existing =
            await VariantAttributeValueRepository.getByVariantAttributeValue(
                data
            )
        if (existing) {
            throw new AppError({
                message: 'Variant attribute value already exists',
                code: ERROR_CODES.VARIANT_ATTRIBUTE_VALUE.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: {
                    resource: 'variant-attribute-value',
                    variant_id: data.variant_id,
                    attribute_value_id: data.attribute_value_id,
                },
            })
        }
        const variantAttributeValue =
            await VariantAttributeValueRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: variantAttributeValue,
            message: 'Successfully added',
        }
    }
    static async remove(body) {
        console.log(body)
        const variantAttributeValue =
            await this.findByVariantIdAttributeValueIdOrThrow(body)

        await VariantAttributeValueRepository.delete(body)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: variantAttributeValue,
            message: 'VariantAttributeValue deleted',
        }
    }
}
