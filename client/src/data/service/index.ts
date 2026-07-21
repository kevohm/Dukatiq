import { BrandService } from './catalog/brand.service'
import { ProductCategoryService } from './catalog/product.category.service'
import { ProductService } from './catalog/product.service'
import { ProductUnitService } from './catalog/product.unit.service'
import { UnitService } from './catalog/unit.service'
import { ExpenseCategoryService } from './expense/expense.category.service'
import { ExpenseService } from './expense/expense.service'
import { SaleService } from './sale/sale.service'

export const productService = new ProductService()

export const productCategoryService = new ProductCategoryService()

export const brandService = new BrandService()

export const productUnitService = new ProductUnitService()
export const unitService = new UnitService()
export const saleService = new SaleService()

export const expenseService = new ExpenseService()
export const expenseCategoryService = new ExpenseCategoryService()

