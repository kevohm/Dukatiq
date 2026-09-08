import { StatusCodes } from 'http-status-codes'
import { ProductRepository } from './product.repository.js'
import { ProductValidator } from './product.validator.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { db } from '../../config/database.js'

export class ProductService {
    static async findMany() {
        const data = await ProductRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Products found',
        }
    }

    static async findById(id) {
        const product = await ProductRepository.getById(id)
        if (!product) {
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'product', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: product,
            message: 'Product found',
        }
    }
    static async findByIdOrThrow(id) {
        try {
            return await this.findById(id)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw error
        }
    }
    static async add(body) {
        const data = await ProductValidator.createSchema.parseAsync(body)
        const product = await db.transaction(async (manager) => {
            return ProductRepository.create(data, manager)
        })

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: product,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const response = await this.findByIdOrThrow(id)
        if (!response?.success) {
            return response
        }
        const data = await ProductValidator.updateSchema.parseAsync(body)

        const result = await ProductRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update product',
                code: ERROR_CODES.PRODUCT.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: response?.data,
            message: 'Product updated',
        }
    }

    static async remove(id) {
        const response = await this.findById(id)
        const deleted = await ProductRepository.delete(id)
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete product',
                code: ERROR_CODES.PRODUCT.DELETE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'product', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: response?.data,
            message: 'Product deleted',
        }
    }
}
