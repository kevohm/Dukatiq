import type { PaginationQuery } from '@/data/repositories/base.repository'
import { getRepositories } from '../../repositories'
import type {
    IExpenseCreatePayload,
    IExpenseUpdatePayload,
} from '@/features/expenses/types'
import type { MangoQuery } from 'rxdb'
import type { ExpenseDoc } from '@/data/models/expense/expense'
import { baseQueryBuilder } from '@/utils/pagination'

export class ExpenseService {
    async getAll(query: PaginationQuery = {}) {
        const { expenseCategoryRepository, expenseRepository } =
            await getRepositories()
        const mangoQuery: MangoQuery<ExpenseDoc> = {
            selector: {},
        }
        mangoQuery['selector'] = baseQueryBuilder(query)
        const expenseData = await expenseRepository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })

        const expenses = expenseData?.data

        if (!expenses.length) {
            return { ...expenseData, data: [] }
        }

        // Fetch categories
        const categoryIds = [
            ...new Set(
                expenses.map((expense) => expense.category_id).filter(Boolean)
            ),
        ]

        const categories = await expenseCategoryRepository.findByIds(
            categoryIds
        )

        const categoryMap = new Map(
            categories.map((category) => [category.id, category])
        )

        const results = expenses.map((expense) => ({
            ...expense,
            category: expense.category_id
                ? categoryMap.get(expense.category_id)
                : null,
        }))

        return {
            ...expenseData,
            data: results,
        }
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

        const category = await expenseCategoryRepository.findOrCreate(
            categoryName
        )

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
