import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Product } from '../../../src/api/product/product.model.js'
import { Category } from '../../../src/api/product/category/product.category.model.js'
import { ProductRepository } from '../../../src/api/product/product.repository.js'
import { productFactory } from '../../utils/factory.js'

describe('ProductRepository', () => {


    it('should create product and auto-create category', async () => {
        const input = productFactory({ category: 'Food' })

        const product = await ProductRepository.create(input)

        const category = await Category.findByPk(product.category_id)

        expect(product).toBeDefined()
        expect(product.name).toBe(input.name)
        expect(product.category_id).toBeDefined()
        expect(category).toBeDefined()
        expect(category.name).toBe('Food')
    })

    it('should link product to existing category or reuse it', async () => {
        const category = await Category.create({ name: 'Drinks' })

        const product = await ProductRepository.create(
            productFactory({ category: 'Drinks' })
        )

        expect(product.category_id).toBe(category.id)
    })

    it('should fetch all products', async () => {
        await ProductRepository.create(productFactory({ category: 'Snacks' }))

        const products = await ProductRepository.getAll()

        expect(products.length).toBe(1)
        expect(products[0].category_id).toBeDefined()
    })

    it('should get product by id', async () => {
        const created = await ProductRepository.create(
            productFactory({ category: 'Food' })
        )

        const fetched = await ProductRepository.getById(created.id)

        expect(fetched).toBeDefined()
        expect(fetched.id).toBe(created.id)
        expect(fetched.name).toBe(created.name)
    })

    it('should update product fields', async () => {
        const created = await ProductRepository.create(
            productFactory({ category: 'Electronics' })
        )

        await ProductRepository.update(created.id, {
            name: 'Updated Name',
            selling_price: 999,
        })

        const updated = await Product.findByPk(created.id)

        expect(updated.name).toBe('Updated Name')
        expect(updated.selling_price).toBe(999)
    })

    it('should delete product', async () => {
        const created = await ProductRepository.create(
            productFactory({ category: 'Home' })
        )

        await ProductRepository.delete(created.id)

        const deleted = await Product.findByPk(created.id)

        expect(deleted).toBeNull()
    })
})
