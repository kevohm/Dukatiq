import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'

import { users } from '../models/user'
import { products } from '../models/product/product'
import { productUnits } from '../models/product/product.unit'
import { sales } from '../models/sale/sales'
import { saleItems } from '../models/sale/sale.items'
import { inventory } from '../models/inventory'
import type { BusinessCollections, BusinessDatabase } from './types'
import { productCategories } from '../models/product/product.category'
import { brands } from '../models/product/product.brand'
import { units } from '../models/product/unit'
import { expenses } from '../models/expense/expense'
import { expenseCategories } from '../models/expense/expense.category'
import { localAccess } from '../models/local-access'
import { localSessions } from '../models/local-session'

addRxPlugin(RxDBDevModePlugin)

const storage = wrappedValidateAjvStorage({
    storage: getRxStorageDexie(),
})

export const collections = {
    users,
    products,
    productUnits,
    units,
    productCategories,
    brands,
    sales,
    saleItems,
    inventory,
    expenses,
    expenseCategories,
    localAccess,
    localSessions
} as const

let dbPromise: Promise<BusinessDatabase> | null = null

export function getDatabase(): Promise<BusinessDatabase> {
    if (dbPromise) {
        return dbPromise
    }

    dbPromise = (async () => {
        const db = await createRxDatabase<BusinessCollections>({
            name: 'businessdb',
            storage,
        
        })

        await db.addCollections(collections)

        return db as BusinessDatabase
    })()

    return dbPromise
}
