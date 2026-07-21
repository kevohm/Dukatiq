import { getRepositories } from '../../repositories'
import type {
    IExpenseCreatePayload,
    IExpenseUpdatePayload,
} from '@/features/expenses/types'

export class ExpenseService {
    async getAll() {
        const { expenseCategoryRepository, expenseRepository } =
            await getRepositories()

        const expenses = await expenseRepository.findAll()

        if (!expenses.length) {
            return []
        }

        // Fetch categories
        const categoryIds = [
            ...new Set(
                expenses.map((expense) => expense.category_id).filter(Boolean)
            ),
        ]

        const categories =
            await expenseCategoryRepository.findByIds(categoryIds)

        const categoryMap = new Map(
            categories.map((category) => [category.id, category])
        )

        return expenses.map((expense) => ({
            ...expense,
            category: expense.category_id
                ? categoryMap.get(expense.category_id)
                : null,
        }))
    }
    async getById(id?: string) {
        const { expenseRepository } = await getRepositories()
        if (!id) {
            throw new Error('Expense does not exist')
        }
        return expenseRepository.findOrThrow(id, 'Expense does not exist')
    }

    async create(payload: IExpenseCreatePayload) {
        const { expenseCategoryRepository, expenseRepository } =
            await getRepositories()

        const { category: categoryName, ...data } = payload

        const category =
            await expenseCategoryRepository.findOrCreate(categoryName)

        const product = await expenseRepository.create({
            ...data,
            category_id: category?.toJSON().id,
        })

        return product
    }

    async update(id: string, payload: IExpenseUpdatePayload) {
        const { expenseCategoryRepository, expenseRepository } =
            await getRepositories()
        if (payload?.category_id) {
            await expenseCategoryRepository.findOrThrow(
                payload.category_id,
                'Category does not exist'
            )
        }

        return expenseRepository.update(id, payload)
    }

    async delete(id: string) {
        const { expenseRepository } = await getRepositories()

        return expenseRepository.delete(id)
    }
}
