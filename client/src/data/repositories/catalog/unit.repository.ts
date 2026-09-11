import type { UnitDoc } from '../../models/product/unit'
import { BaseRepository } from '../base.repository'

export class UnitRepository extends BaseRepository<UnitDoc> {
    findByName(name: string) {
        return this.collection
            .findOne({
                selector: {
                    name,
                },
            })
            .exec()
            .then((d) => d?.toJSON())
    }

    async findOrCreate(name: string) {
        const existing = await this.findByName(name)

        if (existing) {
            return existing
        }

        return this.create({
            name: name.toLowerCase(),
        })?.then((i) => i?.toJSON())
    }

    search(search: string) {
        return this.collection
            .find({
                selector: {
                    name: {
                        $regex: search,
                    },
                },
            })
            .exec()
    }
}
