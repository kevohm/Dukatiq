import { BaseRepository } from '../base.repository'
import type { ExpenseCategoryDoc } from '@/data/models/expense/expense.category'

export class ExpenseCategoryRepository extends BaseRepository<ExpenseCategoryDoc> {
    findByName(name: string) {
        return this.collection
            .findOne({
                selector: {
                    name,
                },
            })
            .exec()
    }

    async findOrCreate(name: string) {
        const existing = await this.findByName(name)

        if (existing) {
            return existing
        }

        return this.create({
            name: name.toLowerCase(),
        })
    }
}
