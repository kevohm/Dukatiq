import express from 'express'
import * as dashboardController from './dashboard.controller.js'

const router = express.Router()

// 📊 Overview
router.get('/overview', dashboardController.getOverview)

// 💰 Sales
router.get('/sales-summary', dashboardController.getSalesSummary)
router.get('/sales-trend', dashboardController.getSalesTrend)
router.get('/recent-sales', dashboardController.getRecentSales)

// 💸 Expenses
router.get('/expense-summary', dashboardController.getExpenseSummary)
router.get('/expense-trend', dashboardController.getExpenseTrend)

// 📦 Inventory
router.get('/inventory-summary', dashboardController.getInventorySummary)
router.get('/low-stock-products', dashboardController.getLowStockProducts)

// 🏆 Products
router.get('/top-selling-products', dashboardController.getTopSellingProducts)

router.get(
    '/top-profitable-products',
    dashboardController.getTopProfitableProducts
)

export default router
