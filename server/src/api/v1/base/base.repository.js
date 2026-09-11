
export class BaseRepository {
    constructor(repo) {
        this.repo = repo
    }

    async getAll() {
        return this.repo.find()
    }

    async getById(id) {
        return this.repo.findOneBy({ id })
    }

    async getBy(field, value) {
        return this.repo.findOne({
            where: {
                [field]: value,
            },
        })
    }

    async create(data, manager = this.repo.manager) {
        const entity = this.repo.create(data)
        return manager.save(entity)
    }

    async update(id, data) {
        await this.repo.update(id, data)
        return this.getById(id)
    }

    async delete(id) {
        return this.repo.delete(id)
    }
}
