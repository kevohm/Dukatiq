import { StatusCodes } from 'http-status-codes'
import { ExpenseCategoryRepository} from './expense.category.repository.js'
import { ExpenseCategoryValidator } from './expense.category.validator.js'

export class ExpenseCategoryService {
    static async findMany() {
        return ExpenseCategoryRepository.getAll()
    }

    static async findById(id) {
        const category = await ExpenseCategoryRepository.getById(id)
        if (!category) {
            return {
                status: StatusCodes.NOT_FOUND,
                success: false,
                message: 'Category not found',
            }
        }
        return category
    }
    static async add(body) {
        const data = await ExpenseCategoryValidator.createSchema.parseAsync(body)
        const existingCat = await ExpenseCategoryRepository.getByName(data?.name);
        if(existingCat){
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                data: existingCat,
                message: 'Category already exists',
            }
        }
        const category = await ExpenseCategoryRepository.create(data)

        return {
            status: StatusCodes.OK,
            success: true,
            data: category,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const category = await this.findById(id)

        const data = await ExpenseCategoryValidator.updateSchema.parseAsync(body)

        const result = await ExpenseCategoryRepository.update(id, data)
        if (result[0] === 0) {
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to update category',
            }
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
        await ExpenseCategoryRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: category,
            message: 'Category deleted',
        }
    }
}
