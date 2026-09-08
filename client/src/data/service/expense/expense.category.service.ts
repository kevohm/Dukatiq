import type { ExpenseCategoryRepository } from '@/data/repositories/expense/expense.category.repository'
import { getRepositories } from '../../repositories'
import { BaseService } from '../base.service'

export class ExpenseCategoryService extends BaseService<ExpenseCategoryRepository> {
    constructor() {
        super(async () => {
            const { expenseCategoryRepository } = await getRepositories()
            return expenseCategoryRepository
        })
    }
    async getByName(name: string) {
        const { expenseCategoryRepository } = await getRepositories()
        const category = await expenseCategoryRepository.findByName(name)
        return category
    }
}
