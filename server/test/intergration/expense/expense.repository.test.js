import { describe, it, expect } from 'vitest'

import { expenseFactory } from '../../utils/factory.js'
import { ExpenseRepository } from '../../../src/api/expense/expense.repository.js'
import { ExpenseCategory } from '../../../src/api/expense/category/expense.category.model.js'
import { Expense } from '../../../src/api/expense/expense.model.js'
import { sequelize } from '../../../src/config/database.js'

describe('ExpenseRepository', () => {

    it('should rollback if something fails in transaction', async () => {
        const t = await sequelize.transaction()

        try {
            await ExpenseRepository.create(
                { name: null, amount: 100, category: 'Fail' }, // invalid name
                t
            )

            await t.commit()
        } catch {
            await t.rollback()
        }

        const expenses = await Expense.findAll()
        expect(expenses.length).toBe(0)
    })
    it('should create expense and auto-create category', async () => {
        const expenseData = expenseFactory({
            name: 'Lunch',
            amount: 200,
            category: 'Food',
        })

        const expense = await ExpenseRepository.create(expenseData)

        expect(expense).toBeDefined()
        expect(expense.id).toBeDefined()
        expect(expense.category_id).toBeDefined()

        const category = await ExpenseCategory.findByPk(expense.category_id)
        expect(category.name).toBe('Food')
    })

    it('should reuse existing category instead of creating duplicate', async () => {
        const data1 = expenseFactory({ category: 'Transport' })
        const data2 = expenseFactory({ category: 'Transport' })

        const e1 = await ExpenseRepository.create(data1)
        const e2 = await ExpenseRepository.create(data2)

        expect(e1.category_id).toBe(e2.category_id)

        const categories = await ExpenseCategory.findAll({
            where: { name: 'Transport' },
        })

        expect(categories.length).toBe(1) // 🔥 critical test
    })

    it('should fetch expense by id', async () => {
        const expense = await ExpenseRepository.create(
            expenseFactory({ category: 'Misc' })
        )

        const found = await ExpenseRepository.getById(expense.id)

        expect(found).toBeDefined()
        expect(found.id).toBe(expense.id)
    })

    it('should update expense', async () => {
        const expense = await ExpenseRepository.create(
            expenseFactory({ amount: 100, category: 'Food' })
        )

        await ExpenseRepository.update(expense.id, { amount: 500 })

        const updated = await Expense.findByPk(expense.id)

        expect(updated.amount).toBe(500)
    })

    it('should delete expense', async () => {
        const expense = await ExpenseRepository.create(
            expenseFactory({ category: 'DeleteTest' })
        )

        await ExpenseRepository.delete(expense.id)

        const found = await Expense.findByPk(expense.id)
        expect(found).toBeNull()
    })
})
