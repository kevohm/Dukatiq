import express from 'express'
import productRoutes from '../api/product/product.route.js'
import productCategoryRoutes from '../api/product/category/product.category.route.js'
import authRoutes from '../api/auth/auth.route.js'
import expenseRoutes from '../api/expense/expense.route.js'
import expenseCategoryRoutes from '../api/expense/category/expense.category.route.js'
const router = express.Router()

router.use('/products', productRoutes)
router.use('/product-category', productCategoryRoutes)
router.use('/auth', authRoutes)
router.use("/expense", expenseRoutes )
router.use('/expense-category', expenseCategoryRoutes)
export const appRouter = router

