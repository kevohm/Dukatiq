export class BaseService<
    TRepository extends {
        findAll(): Promise<unknown[]>
        findOrThrow(id: string, message?: string): Promise<any>
        create(data: unknown): Promise<any>
        update(id: string, data: unknown): Promise<any>
        delete(id: string): Promise<any>
    },
> {
    protected getRepository: () => Promise<TRepository>

    constructor(getRepository: () => Promise<TRepository>) {
        this.getRepository = getRepository
    }

    async getAll() {
        const repository = await this.getRepository()

        const docs = await repository.findAll()

        return docs.map((doc: any) => (doc.toJSON ? doc.toJSON() : doc))
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
