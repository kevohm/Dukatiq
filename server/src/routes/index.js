import express from 'express'
import productRoutes from '../api/product/product.route.js'
import productCategoryRoutes from '../api/product/category/product.category.route.js'
import productBrandRoutes from '../api/product/brand/product.brand.route.js'
import authRoutes from '../api/auth/auth.route.js'
import expenseRoutes from '../api/expense/expense.route.js'
import expenseCategoryRoutes from '../api/expense/category/expense.category.route.js'
import fileRoutes from '../api/file/file.route.js'
import inventoryRoutes from "../api/inventory/inventory.route.js";
import unitRoutes from "../api/product/unit/unit.route.js";
import productUnitRoutes from '../api/product/product-unit/product.unit.route.js'
import saleRoutes from '../api/sale/sale.route.js'
import dashboardRoutes from '../api/dashboard/dashboard.route.js'
import syncRoutes from '../api/sync/sync.route.js'
import recoveryRoutes from '../api/recovery/recovery.routes.js'

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


export const appRouter = router


