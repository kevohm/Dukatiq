import { StatusCodes } from 'http-status-codes'
import { ExpenseCategoryRepository } from './expense.category.repository.js'
import { ExpenseCategoryValidator } from './expense.category.validator.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'

export class ExpenseCategoryService {
    static async findMany() {
        const categories = await ExpenseCategoryRepository.getAll()

        return {
            status: StatusCodes.OK,
            success: true,
            data: categories,
            message: 'Categories found',
        }
    }

    static async findById(id) {
        const category = await ExpenseCategoryRepository.getById(id)
        if (!category) {
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.EXPENSE_CATEGORY.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'expense_category', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: category,
            message: 'Category found',
        }
    }
    static async add(body) {
        const data =
            await ExpenseCategoryValidator.createSchema.parseAsync(body)
        const existingCat = await ExpenseCategoryRepository.getByName(
            data?.name
        )
        if (existingCat) {
            throw new AppError({
                message: 'Category already exists',
                code: ERROR_CODES.EXPENSE_CATEGORY.ALREADY_EXISTS,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'expense_category', name: data?.name },
            })
        }
        const category = await ExpenseCategoryRepository.create(data)

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
            await ExpenseCategoryValidator.updateSchema.parseAsync(body)

        const result = await ExpenseCategoryRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update category',
                code: ERROR_CODES.EXPENSE_CATEGORY.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'expense_category', id },
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
        const response = await this.findById(id)
        if (!response?.success) {
            return response
        }
        await ExpenseCategoryRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            message: 'Category deleted',
        }
    }
}
