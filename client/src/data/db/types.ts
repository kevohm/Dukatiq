import type { RxCollection, RxDatabase } from 'rxdb'

import type { UserDoc } from '../models/user'
import type { ProductDoc } from '../models/product/product'

import type { ProductUnitDoc } from '../models/product/product.unit'


import type { SaleDoc } from '../models/sale/sales'


import type { SaleItemDoc } from '../models/sale/sale.items'


import type { InventoryDoc } from '../models/inventory'

import type { UnitDoc } from '../models/product/unit'
import type { ProductCategoryDoc } from '../models/product/product.category'
import type { BrandDoc } from '../models/product/product.brand'
import type { ExpenseDoc } from '../models/expense/expense'
import type { ExpenseCategoryDoc } from '../models/expense/expense.category'
import type { LocalAccessDoc } from '../models/local-access'
import type { LocalSessionDoc } from '../models/local-session'

export interface BusinessCollections {
    users: RxCollection<UserDoc>
    products: RxCollection<ProductDoc>
    productUnits: RxCollection<ProductUnitDoc>
    productCategories: RxCollection<ProductCategoryDoc>
    brands: RxCollection<BrandDoc>
    units: RxCollection<UnitDoc>
    sales: RxCollection<SaleDoc>
    saleItems: RxCollection<SaleItemDoc>
    inventory: RxCollection<InventoryDoc>
    expenses: RxCollection<ExpenseDoc>
    expenseCategories: RxCollection<ExpenseCategoryDoc>
    localAccess: RxCollection<LocalAccessDoc>
    localSessions: RxCollection<LocalSessionDoc>
}

export type BusinessDatabase = RxDatabase<BusinessCollections>
