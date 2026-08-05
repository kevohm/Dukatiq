import { isNumberSet } from '@/utils/number'
import type { MangoQuery, RxCollection } from 'rxdb'

export interface BaseDocument {
    id: string
    created_at: string
    updated_at: string
}

export interface PaginationQuery {
    page?: number
    limit?: number
}

export class BaseRepository<T extends BaseDocument> {
    protected readonly collection: RxCollection<T>

    constructor(collection: RxCollection<T>) {
        this.collection = collection
    }
    protected generate() {
        const now = new Date().toISOString()
        return {
            id: crypto.randomUUID(),
            created_at: now,
            updated_at: now,
        }
    }
    protected withAuditFields(
        data: Omit<T, 'created_at' | 'updated_at' | 'id'> &
            Partial<Pick<T, 'id'>>
    ): T {
        const basePayload = this.generate()

        return {
            ...data,
            ...basePayload,
            id: data.id ?? basePayload?.id,
        } as T
    }

    async findByIds(ids: string[]) {
        if (!ids.length) {
            return []
        }

        return this.collection
            .find({
                selector: {
                    //@ts-ignore
                    id: {
                        $in: ids,
                    },
                },
            })
            .exec()
            .then((docs) => docs.map((doc) => doc.toJSON()))
    }

    create(doc: Omit<T, 'created_at' | 'updated_at' | 'id'>) {
        return this.collection.insert(this.withAuditFields(doc))
    }

    bulkInsert(docs: Omit<T, 'created_at' | 'updated_at' | 'id'>[]) {
        const documents = docs?.map((doc) => this.withAuditFields(doc))
        return this.collection.bulkInsert(documents)
    }

    async update(id: string, changes: Partial<T>) {
        const doc = await this.findById(id)

        if (!doc) {
            return null
        }

        await doc.incrementalPatch({
            ...changes,
            updated_at: new Date().toISOString(),
        })

        return doc
    }

    bulkUpsert(docs: T[]) {
        return this.collection.bulkUpsert(docs)
    }
    async findAll({
        mangoQuery,
        query,
    }: {
        mangoQuery?: MangoQuery<T>
        query: { page?: number; limit?: number }
    }) {
        let limit = mangoQuery?.limit
        let skip = mangoQuery?.skip

        if (mangoQuery && mangoQuery?.selector) {
            mangoQuery['selector'] = { ...mangoQuery?.selector }
            if (query?.page && query?.limit) {
                limit = query?.limit
                skip = (query?.page - 1) * query?.limit
                mangoQuery['limit'] = query.limit
                mangoQuery['skip'] = (query?.page - 1) * query?.limit
            }
        }

        const docs = await this.collection
            .find(mangoQuery)
            .exec()
            .then((docs) => docs.map((doc) => doc?.toJSON()))

        let pagination: {
            total?: number
            limit?: number
            skip?: number
            page?: number
            total_pages?: number
            rangeStart?: number
            rangeEnd?: number
        } = {
            total: 0,
            limit: limit,
            skip: skip,
            page: undefined,
            total_pages: undefined,
            rangeStart: undefined,
            rangeEnd: undefined,
        }

        const count = await this.collection
            .count({
                selector: mangoQuery?.selector,
            })
            .exec()

        /**
         *  limit = 1
         *  page = 1
         *  skip = limit * (page - 1)
         *  page = (skip / limit) + 1
         *  count =
         *  pages = 10 / limit
         */

        if (isNumberSet(limit) && isNumberSet(skip) && limit > 0) {
            pagination = {
                total: count,
                limit: limit,
                skip: skip,
                page: Number(skip / limit + 1),
                total_pages: Math.max(1, Math.trunc(count / limit)),
                rangeStart: count === 0 ? 0 : skip + 1,
                rangeEnd: Math.min(skip + limit, count),
            }
        }

        return {
            data: docs,
            ...pagination,
        }
    }

    findById(id: string) {
        return this.collection.findOne(id).exec()
    }
    async findOrThrow(id: string, message?: string) {
        const doc = await this.findById(id)

        if (!doc) {
            throw new Error(message ?? `${this.collection.name} not found`)
        }

        return doc.toJSON()
    }
    async delete(id: string) {
        const doc = await this.findById(id)

        if (!doc) {
            return false
        }

        await doc.remove()

        return true
    }

    async bulkDelete(ids: string[]) {
        const docs = await Promise.all(ids.map((id) => this.findById(id)))

        await Promise.all(docs.filter(Boolean).map((doc) => doc!.remove()))
    }
}
