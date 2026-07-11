import { db } from '../../config/database.js'
import { Product } from '../../entities/product/product.model.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'
import { ProductBrandRepository } from './brand/product.brand.repository.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { InventoryRepository } from '../inventory/inventory.repository.js'

export class ProductRepository {
    static repo = db.getRepository(Product)

    static async getAll() {
        return this.repo.find({
            relations: {
                category: true,
                brand: true,
                productUnits: {
                    unit: true,
                },
            },
        })
    }

    static async getById(id) {
        const product = await this.repo.findOne({
            where: { id },
            relations: {
                category: true,
                brand: true,
                productUnits: {
                    unit: true,
                },
            },
        })

        if (!product) {
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product', id },
            })
        }

        return product
    }

    static async create(data, manager = this.repo.manager) {
        const category = await ProductCategoryRepository.findOrCreate(
            { name: data.category },
            manager
        )

        const brand = await ProductBrandRepository.findOrCreate(
            { name: data.brand },
            manager
        )
       // console.log(brand, category)
       const {stock_quantity, ...rest} = data
        const product = manager.create(Product, {
            ...rest,
            category,
            stock_quantity:0,
            brand,
        })

        return manager.save(Product, product)
    }

    static async update(id, data) {
        const result = await this.repo.update(id, data)

        if (!result.affected) {
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product', id },
            })
        }

        return this.getById(id)
    }

    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete product',
                code: ERROR_CODES.PRODUCT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product', id },
            })
        }

        return true
    }

    static async applyStockChange({
        id,
        quantity,
        manager = this.repo.manager,
    }) {
        await manager.increment(Product, { id }, 'stock_quantity', quantity)

        return this.getById(id)
    }
}
