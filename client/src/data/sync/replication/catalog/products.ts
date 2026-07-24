import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '../sync.collections'
import { baseConfig } from '../../config'
import { replicateRxCollection } from 'rxdb/plugins/replication'
import type { ProductDoc } from '@/data/models/product/product'
import type { RxCollection } from 'rxdb'
import { syncApi } from '../../api'


export function replicateProducts(db: BusinessDatabase) {
    const collection = db.products as RxCollection<ProductDoc>
    const name = SyncCollections.PRODUCT

    return replicateRxCollection<ProductDoc, any>({
        collection,
        replicationIdentifier: `catalog/${name}`,
        ...baseConfig,
        push: {
            batchSize: 50,

            async handler(rows) {
                const categoryIds = [
                    ...new Set(
                        rows
                            .map((row) => row.newDocumentState?.category_id)
                            .filter(Boolean)
                    ),
                ]

                const brandIds = [
                    ...new Set(
                        rows
                            .map((row) => row.newDocumentState?.brand_id)
                            .filter(Boolean)
                    ),
                ]

                const [categories, brands] = await Promise.all([
                    db.productCategories
                        .find({
                            selector: {
                                id: {
                                    $in: categoryIds,
                                },
                            },
                        })
                        .exec(),

                    db.brands
                        .find({
                            selector: {
                                id: {
                                    $in: brandIds,
                                },
                            },
                        })
                        .exec(),
                ])

                const categoryMap = new Map(
                    categories.map((category) => [category.id, category])
                )

                const brandMap = new Map(
                    brands.map((brand) => [brand.id, brand])
                )

                const transformed = rows.map((row) => {
                    const doc = row.newDocumentState

                    return {
                        ...row,
                        newDocumentState: {
                            ...doc,

                            category_name:
                                categoryMap.get(doc.category_id)?.name ?? null,

                            brand_name:
                                brandMap.get(doc.brand_id)?.name ?? null,
                        },
                    }
                })

                return syncApi.push(name, transformed)
            },

            modifier(doc) {
                return doc
            },
        },

        pull: {
            batchSize: 100,

            handler(checkpoint, batchSize) {
                return syncApi.pull(name, checkpoint, batchSize)
            },

            modifier(doc) {
                return doc
            },
        },
    })
}
