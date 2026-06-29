import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ProductCategoryRepository } from '../../../../src/api/product/category/product.category.repository'
import { Category } from '../../../../src/api/product/category/product.category.model'



describe('ProductCategory', () => {

    it('should create category', async () => {
        const category = await ProductCategoryRepository.create({
            name: 'Food',
        })

        expect(category).toBeDefined()
        expect(category.id).toBeDefined()
        expect(category.name).toBe('Food')
    })

    it('should not allow duplicate names (findOrCreate behavior)', async () => {
        const first = await ProductCategoryRepository.findOrCreate({
            name: 'Electronics',
        })

        const second = await ProductCategoryRepository.findOrCreate({
            name: 'Electronics',
        })

        const all = await Category.findAll()

        expect(first.id).toBe(second.id)
        expect(all.length).toBe(1)
        expect(all[0].name).toBe('Electronics')
    })

    it('should fetch category by id', async () => {
        const created = await ProductCategoryRepository.create({
            name: 'Books',
        })

        const fetched = await ProductCategoryRepository.getById(created.id)

        expect(fetched).toBeDefined()
        expect(fetched.id).toBe(created.id)
        expect(fetched.name).toBe('Books')
    })

    it('should fetch category by name', async () => {
        await ProductCategoryRepository.create({
            name: 'Clothing',
        })

        const category = await ProductCategoryRepository.getByName('Clothing')

        expect(category).toBeDefined()
        expect(category.name).toBe('Clothing')
    })

    it('should update category', async () => {
        const created = await ProductCategoryRepository.create({
            name: 'Old Name',
        })

        await ProductCategoryRepository.update(created.id, {
            name: 'New Name',
        })

        const updated = await Category.findByPk(created.id)

        expect(updated.name).toBe('New Name')
    })

    it('should delete category', async () => {
        const created = await ProductCategoryRepository.create({
            name: 'ToDelete',
        })

        await ProductCategoryRepository.delete(created.id)

        const deleted = await Category.findByPk(created.id)

        expect(deleted).toBeNull()
    })
})
