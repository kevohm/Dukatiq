import type { RxCollection } from 'rxdb'

export interface BaseDocument {
    id: string
    created_at: string
    updated_at: string
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

    findAll() {
        return this.collection
            .find()
            .exec()
            .then((docs) => docs.map((doc) => doc.toJSON()))
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
