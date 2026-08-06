import type { MangoQuery } from 'rxdb'
import type {
    IFindAllReturnType,
    PaginationQuery,
} from '../repositories/base.repository'
import { baseQueryBuilder, type IQueryBuilderArgs } from '@/utils/pagination'

type IQuery = {
    mangoQuery?: MangoQuery<any>
    query: { page?: number; limit?: number }
}

export class BaseService<
    TRepository extends {
        findAll(query: IQuery): Promise<IFindAllReturnType<unknown>>
        findOrThrow(id: string, message?: string): Promise<any>
        create(data: unknown): Promise<any>
        update(id: string, data: unknown): Promise<any>
        delete(id: string): Promise<any>
    }
> {
    protected getRepository: () => Promise<TRepository>

    constructor(getRepo: () => Promise<TRepository>) {
        this.getRepository = getRepo
    }

    async getAll(query: PaginationQuery={}, opts: IQueryBuilderArgs = {}) {
        const repository = await this.getRepository()
        const mangoQuery: MangoQuery<any> = {
            selector: {},
        }
        mangoQuery['selector'] = baseQueryBuilder(query, opts)

        const results = await repository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })

        return results
    }

    async getById(id?: string, message?: string) {
        if (!id) {
            throw new Error(message ?? 'Record does not exist')
        }

        const repository = await this.getRepository()

        const doc = await repository.findOrThrow(id, message)

        return doc.toJSON ? doc.toJSON() : doc
    }

    async create(payload: unknown) {
        const repository = await this.getRepository()

        return repository.create(payload)
    }

    async update(id: string, payload: unknown) {
        const repository = await this.getRepository()

        return repository.update(id, payload)
    }

    async delete(id: string) {
        const repository = await this.getRepository()

        return repository.delete(id)
    }
}
