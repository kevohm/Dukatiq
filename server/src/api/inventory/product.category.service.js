import { StatusCodes } from 'http-status-codes'
import { ProductCategoryRepository} from './product.category.repository.js'
import { ProductCategoryValidator } from './product.category.validator.js'

export class ProductCategoryService {
    static async findMany() {
        return ProductCategoryRepository.getAll()
    }

    static async findById(id) {
        const category = await ProductCategoryRepository.getById(id)
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
        const data = await ProductCategoryValidator.createSchema.parseAsync(body)
        const existingCat = await ProductCategoryRepository.getByName(data?.name);
        if(existingCat){
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                data: existingCat,
                message: 'Category already exists',
            }
        }
        const category = await ProductCategoryRepository.create(data)

        return {
            status: StatusCodes.OK,
            success: true,
            data: category,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const category = await this.findById(id)

        const data = await ProductCategoryValidator.updateSchema.parseAsync(body)

        const result = await ProductCategoryRepository.update(id, data)
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
        await ProductCategoryRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: category,
            message: 'Category deleted',
        }
    }
}
