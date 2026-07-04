import { StatusCodes } from 'http-status-codes'
import { ProductCategoryRepository } from './product.category.repository.js'
import { ProductCategoryValidator } from './product.category.validator.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductCategoryService {
    static async findMany() {
        const data = await ProductCategoryRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Expense category found',
        }
    }

    static async findById(id) {
        const category = await ProductCategoryRepository.getById(id)
        if (!category) {
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product_category', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: category,
            message: 'Expense category found',
        }
    }
    static async add(body) {
        const data =
            await ProductCategoryValidator.createSchema.parseAsync(body)
        const existingCat = await ProductCategoryRepository.getByName(
            data?.name
        )
        if (existingCat) {
            throw new AppError({
                message: 'Category already exists',
                code: ERROR_CODES.PRODUCT_CATEGORY.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'product_category', name: data?.name },
            })
        }
        const category = await ProductCategoryRepository.create(data)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: category,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const category = await this.findById(id)

        const data =
            await ProductCategoryValidator.updateSchema.parseAsync(body)

        const result = await ProductCategoryRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update category',
                code: ERROR_CODES.PRODUCT_CATEGORY.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product_category', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: category,
            message: 'Category updated',
        }
    }

    static async remove(id) {
        const category = await this.findById(id)
        await ProductCategoryRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: category,
            message: 'Category deleted',
        }
    }
}
