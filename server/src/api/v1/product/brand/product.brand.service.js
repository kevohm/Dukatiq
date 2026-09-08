import { StatusCodes } from 'http-status-codes'
import { ProductBrandRepository } from './product.brand.repository.js'
import { ProductBrandValidator } from './product.brand.validator.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'

export class ProductBrandService {
    static async findMany() {
        const data = await ProductBrandRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Product brand found',
        }
    }

    static async findById(id) {
        const brand = await ProductBrandRepository.getById(id)
        if (!brand) {
            throw new AppError({
                message: 'Brand not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product_brand', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: brand,
            message: 'Product brand found',
        }
    }
    static async add(body) {
        const data =
            await ProductBrandValidator.createSchema.parseAsync(body)
        const existingCat = await ProductBrandRepository.getByName(
            data?.name
        )
        if (existingCat) {
            throw new AppError({
                message: 'Brand already exists',
                code: ERROR_CODES.PRODUCT_CATEGORY.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'product_brand', name: data?.name },
            })
        }
        const brand = await ProductBrandRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: brand,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const brand = await this.findById(id)

        const data =
            await ProductBrandValidator.updateSchema.parseAsync(body)

        const result = await ProductBrandRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update brand',
                code: ERROR_CODES.PRODUCT_CATEGORY.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product_brand', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: brand,
            message: 'Brand updated',
        }
    }

    static async remove(id) {
        const brand = await this.findById(id)
        await ProductBrandRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: brand,
            message: 'Brand deleted',
        }
    }
}
