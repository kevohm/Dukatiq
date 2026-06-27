import { StatusCodes } from 'http-status-codes'
import { ProductRepository } from './product.repository.js'
import { ProductValidator } from './product.validator.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'

export class ProductService {
    static async findMany() {
        return ProductRepository.getAll()
    }

    static async findById(id) {
        const product = await ProductRepository.getById(id)
        if (!product) {
            return {
                status: StatusCodes.NOT_FOUND,
                success: false,
                message: 'Product not found',
            }
        }
        return product
    }
    static async add(body, transaction = null) {
        const data = await ProductValidator.createSchema.parseAsync(body)


        const product = await ProductRepository.create(data, transaction)

        return {
            status: StatusCodes.OK,
            success: true,
            data: product,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const product = await this.findById(id)

        const data = await ProductValidator.updateSchema.parseAsync(body)

        const result = await ProductRepository.update(id, data)
        if (result[0] === 0) {
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to update product',
            }
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: product,
            message: 'Product updated',
        }
    }

    static async remove(id) {
        const product = await this.findById(id)
        await ProductRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: product,
            message: 'Product deleted',
        }
    }
}
