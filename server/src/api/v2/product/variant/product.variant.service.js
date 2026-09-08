import { StatusCodes } from 'http-status-codes'
import { ProductVariantRepository } from './product.variant.repository.js'
import { ProductVariantValidator } from './product.variant.validator.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'
import { ProductService } from '../../../v1/product/product.service.js'

export class ProductVariantService {
    static async generateSku(body) {
        const data = await ProductVariantRepository.generateSku(body)
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Product variant Sku generated',
        }
    }
    static async findMany() {
        const data = await ProductVariantRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Product variants found',
        }
    }

    static async findById(id) {
        const productVariant = await ProductVariantRepository.getById(id)
        if (!productVariant) {
            throw new AppError({
                message: 'Product variant not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product-variant', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: productVariant,
            message: 'Product variant found',
        }
    }
    static async add(body) {
        const data = await ProductVariantValidator.createSchema.parseAsync(body)
        await ProductService.findById(data.product_id)
        const productVariant = await ProductVariantRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: productVariant,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const productVariant = await this.findById(id)

        const data = await ProductVariantValidator.updateSchema.parseAsync(body)

        const result = await ProductVariantRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update product variant',
                code: ERROR_CODES.ATTRIBUTE.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product-variant', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: productVariant,
            message: 'Product variant updated',
        }
    }

    static async remove(id) {
        const productVariant = await this.findById(id)
        await ProductVariantRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: productVariant,
            message: 'Product variant deleted',
        }
    }
}
