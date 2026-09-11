import express from 'express'

import productRoutes from '../api/v1/product/product.route.js'
import authRoutes from '../api/v1/auth/auth.route.js'
import dashboardRoutes from '../api/v1/dashboard/dashboard.route.js'
import productCategoryRoutes from '../api/v1/product/category/product.category.route.js'
import productBrandRoutes from '../api/v1/product/brand/product.brand.route.js'
import unitRoutes from "../api/v1/product/unit/unit.route.js";
import productUnitRoutes from '../api/v1/product/product-unit/product.unit.route.js'
import expenseRoutes from '../api/v1/expense/expense.route.js'
import expenseCategoryRoutes from '../api/v1/expense/category/expense.category.route.js'
import inventoryRoutes from "../api/v1/inventory/inventory.route.js";
import saleRoutes from '../api/v1/sale/sale.route.js'

import fileRoutes from '../api/v1/file/file.route.js'
import syncRoutes from '../api/v1/sync/sync.route.js'
import recoveryRoutes from '../api/v1/recovery/recovery.routes.js'


const router = express.Router()

router.use('/products', productRoutes)
router.use('/product-category', productCategoryRoutes)
router.use('/product-brand', productBrandRoutes)
router.use('/auth', authRoutes)
router.use("/expense", expenseRoutes )
router.use('/expense-category', expenseCategoryRoutes)
router.use('/file', fileRoutes)
router.use('/unit', unitRoutes)
router.use('/product-unit', productUnitRoutes)
router.use("/inventory", inventoryRoutes )
router.use('/sale', saleRoutes)
router.use('/analytics', dashboardRoutes)

router.use('/recovery-question', recoveryRoutes)

// Syncing
router.use('/api/sync', syncRoutes)


export const v1Router = router



