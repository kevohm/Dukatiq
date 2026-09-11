import { getDatabase } from '@/data/db'
import { replicateProducts } from '@/data/sync/replication/catalog/products'
import { replicateBrands } from '@/data/sync/replication/catalog/brands'
import { replicateProductUnits } from '@/data/sync/replication/catalog/product.units'
import { replicateCategory } from '@/data/sync/replication/catalog/category'
import { replicateUnits } from '@/data/sync/replication/catalog/units'
import { replicateProductVariants } from './product.variant'

export async function startCatalogSync() {
    const db = await getDatabase()

    await replicateCategory(db)

    await replicateBrands(db)

    await replicateUnits(db)

    await replicateProducts(db)
    
    await replicateProductVariants(db)

    await replicateProductUnits(db)
}
