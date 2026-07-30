import { getDatabase } from '../db'

import { ProductRepository } from './catalog/product.repository'
import { InventoryRepository } from './inventory/inventory.repository'
import { SaleRepository } from './sale/sale.repository'
import { ProductUnitRepository } from './catalog/product.unit.repository'
import { UnitRepository } from './catalog/unit.repository'
import { ProductCategoryRepository } from './catalog/product.category.repository'
import { BrandRepository } from './catalog/product.brand.repository'
import { SaleItemRepository } from './sale/sale.item.repository'
import { ExpenseRepository } from './expense/expense.repository'
import { ExpenseCategoryRepository } from './expense/expense.category.repository'
import { UserRepository } from './sessions/user.repository'
import { LocalAccessRepository } from './sessions/local.access.repository'
import { LocalSessionRepository } from './sessions/local.session.repository'

export async function getRepositories() {
    const db = await getDatabase()
    return {
        productRepository: new ProductRepository(db.products),
        productCategoryRepository: new ProductCategoryRepository(
            db.productCategories
        ),
        brandRepository: new BrandRepository(db.brands),
        productUnitRepository: new ProductUnitRepository(db.productUnits),
        unitRepository: new UnitRepository(db.units),
        inventoryRepository: new InventoryRepository(db.inventory),
        saleRepository: new SaleRepository(db.sales),
        saleItemRepository: new SaleItemRepository(db.saleItems),
        expenseRepository: new ExpenseRepository(db.expenses),
        expenseCategoryRepository: new ExpenseCategoryRepository(
            db.expenseCategories
        ),
        userRepository: new UserRepository(db.users),
        localAccessRepository: new LocalAccessRepository(db.localAccess),
        localSessionRepository: new LocalSessionRepository(db.localSessions),
    }
}
