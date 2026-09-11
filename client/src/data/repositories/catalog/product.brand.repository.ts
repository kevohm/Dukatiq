import { BaseRepository } from "@/data/repositories/base.repository";
import type { BrandDoc } from "../../models/product/product.brand";

export class BrandRepository extends BaseRepository<BrandDoc> {
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
