import { describe, it, expect } from 'vitest'
import { ExpenseCategoryRepository } from '../../../../src/api/expense/category/expense.category.repository'
import { ExpenseCategory } from '../../../../src/api/expense/category/expense.category.model'

describe('ExpenseCategoryRepository', () => {
    it('should create category', async () => {
        const category = await ExpenseCategoryRepository.create({
            name: 'Food',
        })

        expect(category).toBeDefined()
        expect(category.id).toBeDefined()
        expect(category.name).toBe('Food')
    })

    it('should enforce unique name', async () => {
        await ExpenseCategoryRepository.create({ name: 'Transport' })

        let error

        try {
            await ExpenseCategoryRepository.create({ name: 'Transport' })
        } catch (err) {
            error = err
        }

        expect(error).toBeDefined()
        expect(error.name).toBe('SequelizeUniqueConstraintError')
    })

    it('should find category by name', async () => {
        await ExpenseCategoryRepository.create({ name: 'Utilities' })

        const found = await ExpenseCategoryRepository.getByName('Utilities')

        expect(found).toBeDefined()
        expect(found.name).toBe('Utilities')
    })

    it('should not create duplicate when using findOrCreate', async () => {
        const c1 = await ExpenseCategoryRepository.findOrCreate({
            name: 'Health',
        })

        const c2 = await ExpenseCategoryRepository.findOrCreate({
            name: 'Health',
        })

        expect(c1.id).toBe(c2.id)

        const all = await ExpenseCategory.findAll({
            where: { name: 'Health' },
        })

        expect(all.length).toBe(1) // 🔥 critical integrity check
    })

    it('should update category', async () => {
        const category = await ExpenseCategoryRepository.create({
            name: 'OldName',
        })

        await ExpenseCategoryRepository.update(category.id, {
            name: 'NewName',
        })

        const updated = await ExpenseCategory.findByPk(category.id)

        expect(updated.name).toBe('NewName')
    })

    it('should delete category', async () => {
        const category = await ExpenseCategoryRepository.create({
            name: 'ToDelete',
        })

        await ExpenseCategoryRepository.delete(category.id)

        const found = await ExpenseCategory.findByPk(category.id)

        expect(found).toBeNull()
    })
})
