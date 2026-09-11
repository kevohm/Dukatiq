import { DashboardService } from './dashboard.service.js'


// 📊 Dashboard overview
export const getOverview = async (req, res) => {
    const response = await DashboardService.getOverview()

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 💰 Sales summary
export const getSalesSummary = async (req, res) => {
    const response = await DashboardService.getSalesSummary()

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 💸 Expense summary
export const getExpenseSummary = async (req, res) => {
    const response = await DashboardService.getExpenseSummary()

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 📦 Inventory summary
export const getInventorySummary = async (req, res) => {
    const response = await DashboardService.getInventorySummary()

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// ⚠️ Low stock products
export const getLowStockProducts = async (req, res) => {
    const response = await DashboardService.getLowStockProducts()

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 📈 Sales trend
export const getSalesTrend = async (req, res) => {
    const response = await DashboardService.getSalesTrend(req.query)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 📉 Expense trend
export const getExpenseTrend = async (req, res) => {
    const response = await DashboardService.getExpenseTrend(req.query)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 🏆 Top selling products
export const getTopSellingProducts = async (req, res) => {

    const response = await DashboardService.getTopSellingProducts(req.query)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 💵 Top profitable products
export const getTopProfitableProducts = async (req, res) => {
    const response = await DashboardService.getTopProfitableProducts(req.query)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 🧾 Recent sales
export const getRecentSales = async (req, res) => {
    const response = await DashboardService.getRecentSales(req.query)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}
