import express from 'express'
import productRoutes from '../api/product/product.route.js'
import productCategoryRoutes from '../api/product/category/product.category.route.js'
import authRoutes from '../api/auth/auth.route.js'
const router = express.Router()

router.use('/products', productRoutes)
router.use('/product-category', productCategoryRoutes)
router.use('/auth', authRoutes)

export const appRouter = router

