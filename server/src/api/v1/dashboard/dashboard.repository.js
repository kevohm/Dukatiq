import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import {
    brands,
    expenses,
    productCategories,
    products,
    saleItems,
    sales,
    units,
} from '../../../db/schema.js'

const number = (value) => Number(value ?? 0)
export class DashboardRepository {
    static async getOverview() {
        const [salesSummary, expensesSummary, inventory, lowStock, products] =
            await Promise.all([
                this.getSalesSummary(),
                this.getExpenseSummary(),
                this.getInventorySummary(),
                this.getLowStockCount(),
                this.getProductCount(),
            ])
        return {
            sales: salesSummary,
            expenses: expensesSummary,
            inventory,
            products,
            lowStock,
            netProfit: salesSummary.totalProfit - expensesSummary.totalAmount,
        }
    }
    static async getSalesSummary() {
        const [row] = await db
            .select({
                count: sql`COUNT(*)`,
                totalSales: sql`COALESCE(SUM(${sales.total_amount}), 0)`,
                totalProfit: sql`COALESCE(SUM(${sales.total_profit}), 0)`,
            })
            .from(sales)
        return {
            count: number(row.count),
            totalSales: number(row.totalSales),
            totalProfit: number(row.totalProfit),
        }
    }
    static async getExpenseSummary() {
        const [row] = await db
            .select({
                count: sql`COUNT(*)`,
                totalAmount: sql`COALESCE(SUM(${expenses.amount}), 0)`,
            })
            .from(expenses)
        return {
            count: number(row.count),
            totalAmount: number(row.totalAmount),
        }
    }
    static async getInventorySummary() {
        const [row] = await db
            .select({
                stock: sql`COALESCE(SUM(${products.stock_quantity}), 0)`,
                value: sql`COALESCE(SUM(${products.stock_quantity} * ${products.cost_price}), 0)`,
            })
            .from(products)
        return {
            totalStock: number(row.stock),
            inventoryValue: number(row.value),
        }
    }
    static async getLowStockCount() {
        const [row] = await db
            .select({ count: sql`COUNT(*)` })
            .from(products)
            .where(
                sql`${products.stock_quantity} <= ${products.low_stock_threshold}`
            )
        return number(row.count)
    }
    static async getLowStockProducts(limit = 10) {
        return db
            .select({
                id: products.id,
                name: products.name,
                stock_quantity: products.stock_quantity,
                low_stock_threshold: products.low_stock_threshold,
                image_url: products.image_url,
                category: productCategories.name,
                brand: brands.name,
                shortage: sql`${products.low_stock_threshold} - ${products.stock_quantity}`,
            })
            .from(products)
            .leftJoin(
                productCategories,
                eq(products.category_id, productCategories.id)
            )
            .leftJoin(brands, eq(products.brand_id, brands.id))
            .where(
                sql`${products.stock_quantity} <= ${products.low_stock_threshold}`
            )
            .orderBy(
                desc(
                    sql`${products.low_stock_threshold} - ${products.stock_quantity}`
                )
            )
            .limit(limit)
    }
    static async getProductCount() {
        const [row] = await db.select({ count: sql`COUNT(*)` }).from(products)
        return number(row.count)
    }
    static async getRecentSales(limit = 10) {
        const records = await db
            .select()
            .from(sales)
            .orderBy(desc(sales.created_at))
            .limit(limit)
        return Promise.all(
            records.map(async (sale) => ({
                ...sale,
                items: await db
                    .select({
                        id: saleItems.id,
                        quantity: saleItems.quantity,
                        selling_price: saleItems.selling_price,
                        cost_price: saleItems.cost_price,
                        profit: saleItems.profit,
                        product: products,
                        unit: units,
                    })
                    .from(saleItems)
                    .leftJoin(products, eq(saleItems.product_id, products.id))
                    .leftJoin(units, eq(saleItems.unit_id, units.id))
                    .where(eq(saleItems.sale_id, sale.id)),
            }))
        )
    }
    static async getTopSellingProducts(limit = 10) {
        return db
            .select({
                id: products.id,
                name: products.name,
                totalSold: sql`SUM(${saleItems.quantity})`,
            })
            .from(saleItems)
            .leftJoin(products, eq(saleItems.product_id, products.id))
            .groupBy(products.id)
            .orderBy(desc(sql`SUM(${saleItems.quantity})`))
            .limit(limit)
    }
    static async getTopProfitableProducts(limit = 10) {
        return db
            .select({
                id: products.id,
                name: products.name,
                totalProfit: sql`SUM(${saleItems.profit})`,
            })
            .from(saleItems)
            .leftJoin(products, eq(saleItems.product_id, products.id))
            .groupBy(products.id)
            .orderBy(desc(sql`SUM(${saleItems.profit})`))
            .limit(limit)
    }
    static async getSalesTrend() {
        return db
            .select({
                label: sql`DATE(${sales.created_at})`,
                value: sql`SUM(${sales.total_amount})`,
            })
            .from(sales)
            .groupBy(sql`DATE(${sales.created_at})`)
            .orderBy(sql`DATE(${sales.created_at})`)
    }
    static async getExpenseTrend() {
        return db
            .select({
                label: sql`DATE(${expenses.created_at})`,
                value: sql`SUM(${expenses.amount})`,
            })
            .from(expenses)
            .groupBy(sql`DATE(${expenses.created_at})`)
            .orderBy(sql`DATE(${expenses.created_at})`)
    }
}
