import { StatusCodes } from 'http-status-codes'
import { DashboardRepository } from './dashboard.repository.js'
import { DashboardValidator } from './dashboard.validator.js'

export class DashboardService {
    // 📊 Dashboard overview
    static async getOverview() {
        const overview = await DashboardRepository.getOverview()

        return {
            status: StatusCodes.OK,
            success: true,
            data: overview,
        }
    }

    // 💰 Sales summary
    static async getSalesSummary() {
        const sales = await DashboardRepository.getSalesSummary()

        return {
            status: StatusCodes.OK,
            success: true,
            data: sales,
        }
    }

    // 💸 Expense summary
    static async getExpenseSummary() {
        const expenses = await DashboardRepository.getExpenseSummary()

        return {
            status: StatusCodes.OK,
            success: true,
            data: expenses,
        }
    }

    // 📦 Inventory summary
    static async getInventorySummary() {
        const inventory = await DashboardRepository.getInventorySummary()

        return {
            status: StatusCodes.OK,
            success: true,
            data: inventory,
        }
    }

    // ⚠️ Low stock products
    static async getLowStockProducts() {
        const products = await DashboardRepository.getLowStockProducts()

        return {
            status: StatusCodes.OK,
            success: true,
            data: products,
        }
    }

    // 📈 Sales trend
    static async getSalesTrend(query) {
        const { period } =
            await DashboardValidator.trendSchema.parseAsync(query)
        const trend = await DashboardRepository.getSalesTrend(period)

        return {
            status: StatusCodes.OK,
            success: true,
            data: trend,
        }
    }

    // 📉 Expense trend
    static async getExpenseTrend(query) {
        const { period } =
            await DashboardValidator.trendSchema.parseAsync(query)
        const trend = await DashboardRepository.getExpenseTrend(period)

        return {
            status: StatusCodes.OK,
            success: true,
            data: trend,
        }
    }

    // 🏆 Best-selling products
    static async getTopSellingProducts(query) {
        const { limit } =
            await DashboardValidator.limitSchema.parseAsync(query)
        const products = await DashboardRepository.getTopSellingProducts(limit)

        return {
            status: StatusCodes.OK,
            success: true,
            data: products,
        }
    }

    // 💵 Most profitable products
    static async getTopProfitableProducts(query) {
        const { limit } =
            await DashboardValidator.limitSchema.parseAsync(query)
        const products =
            await DashboardRepository.getTopProfitableProducts(limit)

        return {
            status: StatusCodes.OK,
            success: true,
            data: products,
        }
    }

    // 📋 Recent sales
    static async getRecentSales(query) {
                const { limit } =
                    await DashboardValidator.limitSchema.parseAsync(query)
        const sales = await DashboardRepository.getRecentSales(limit)

        return {
            status: StatusCodes.OK,
            success: true,
            data: sales,
        }
    }
}
