import { describe, it, expect } from 'vitest'
import { expenseFactory } from '../../utils/factory.js'
import { ExpenseRepository } from '../../../src/api/expense/expense.repository.js'
import { db } from '../../../src/config/database.js'
import { expenseCategories, expenses } from '../../../src/db/schema.js'
import { eq } from 'drizzle-orm'

describe('ExpenseRepository', () => {
    // it('should rollback if something fails in transaction', async () => {
    //     const expenseData = await db.transaction(async (tx) => {
    //         try {
    //             await ExpenseRepository.create(
    //                 { name: null, amount: 100, category: 'Fail' }, // invalid name
    //                 tx
    //             )
    //         } catch {}
    //         return tx.select().from(expenses)
    //     })
    //     expect(expenseData.length).toBe(0)
    // })
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

        const [category] = await db
            .select()
            .from(expenseCategories)
            .where(eq(expenseCategories.id, expense.category_id))
        expect(category).toBeDefined()
        expect(category.name).toBe('Food')
    })

    it('should reuse existing category instead of creating duplicate', async () => {
        const data1 = expenseFactory({ category: 'Transport' })
        const data2 = expenseFactory({ category: 'Transport' })

        const e1 = await ExpenseRepository.create(data1)
        const e2 = await ExpenseRepository.create(data2)

        expect(e1.category_id).toBe(e2.category_id)

        const categories = await db
            .select()
            .from(expenseCategories)
            .where(eq(expenseCategories.name, 'Transport'))

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

        const updated = await ExpenseRepository.getById(expense.id)

        expect(updated.amount).toBe(500)
    })

    it('should delete expense', async () => {
        const expense = await ExpenseRepository.create(
            expenseFactory({ category: 'DeleteTest' })
        )

        await ExpenseRepository.delete(expense.id)

        const row = await db
            .select()
            .from(expenses)
            .where(eq(expenses.id, expense.id))
        const found = row[0] ?? null

        expect(found).toBeNull()
    })
})
