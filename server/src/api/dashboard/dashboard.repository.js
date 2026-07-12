import { db } from '../../config/database.js'
import { Sale } from '../../entities/sale/sale.model.js'
import { Expense } from '../../entities/expense/expense.model.js'
import { Product } from '../../entities/product/product.model.js'
import { SaleItem } from '../../entities/sale/saleItem/sale.item.model.js'

export class DashboardRepository {
    static saleRepo = db.getRepository(Sale)
    static expenseRepo = db.getRepository(Expense)
    static productRepo = db.getRepository(Product)
    static saleItemRepo = db.getRepository(SaleItem)

    static async getOverview() {
        const [sales, expenses, inventory, lowStock, products] =
            await Promise.all([
                this.getSalesSummary(),
                this.getExpenseSummary(),
                this.getInventorySummary(),
                this.getLowStockCount(),
                this.getProductCount(),
            ])

        return {
            sales,
            expenses,
            inventory,
            products,
            lowStock,
            netProfit: sales.totalProfit - expenses.totalAmount,
        }
    }

    static async getSalesSummary() {
        const result = await this.saleRepo
            .createQueryBuilder('sale')
            .select('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(sale.total_amount),0)', 'totalSales')
            .addSelect('COALESCE(SUM(sale.total_profit),0)', 'totalProfit')
            .getRawOne()

        return {
            count: Number(result.count),
            totalSales: Number(result.totalSales),
            totalProfit: Number(result.totalProfit),
        }
    }

    static async getExpenseSummary() {
        const result = await this.expenseRepo
            .createQueryBuilder('expense')
            .select('COALESCE(SUM(expense.amount),0)', 'totalAmount')
            .addSelect('COUNT(*)', 'count')
            .getRawOne()

        return {
            count: Number(result.count),
            totalAmount: Number(result.totalAmount),
        }
    }

    static async getInventorySummary() {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .select('COALESCE(SUM(product.stock_quantity),0)', 'stock')
            .addSelect(
                'COALESCE(SUM(product.stock_quantity * product.cost_price),0)',
                'value'
            )
            .getRawOne()

        return {
            totalStock: Number(result.stock),
            inventoryValue: Number(result.value),
        }
    }

    static async getLowStockCount() {
        return this.productRepo
            .createQueryBuilder('product')
            .where('product.stock_quantity <= product.low_stock_threshold')
            .getCount()
    }
    static async getLowStockProducts(limit = 10) {
        return this.productRepo
            .createQueryBuilder('product')
            .leftJoin('product.category', 'category')
            .leftJoin('product.brand', 'brand')
            .select([
                'product.id AS id',
                'product.name AS name',
                'product.stock_quantity AS stock_quantity',
                'product.low_stock_threshold AS low_stock_threshold',
                'product.image_url AS image_url',
                'category.name AS category',
                'brand.name AS brand',
                '(product.low_stock_threshold - product.stock_quantity) AS shortage',
            ])
            .where('product.stock_quantity <= product.low_stock_threshold')
            .orderBy('shortage', 'DESC')
            .limit(limit)
            .getRawMany()
    }

    static async getProductCount() {
        return this.productRepo.count()
    }

    static async getRecentSales(limit = 10) {
        return this.saleRepo.find({
            take: limit,
            order: {
                created_at: 'DESC',
            },
            relations: {
                items: {
                    product: true,
                    unit: true,
                },
            },
        })
    }

    static async getTopSellingProducts(limit = 10) {
        return this.saleItemRepo
            .createQueryBuilder('saleItem')
            .leftJoin('saleItem.product', 'product')
            .select('product.id', 'id')
            .addSelect('product.name', 'name')
            .addSelect('SUM(saleItem.quantity)', 'totalSold')
            .groupBy('product.id')
            .orderBy('totalSold', 'DESC')
            .limit(limit)
            .getRawMany()
    }

    static async getTopProfitableProducts(limit = 10) {
        return this.saleItemRepo
            .createQueryBuilder('saleItem')
            .leftJoin('saleItem.product', 'product')
            .select('product.id', 'id')
            .addSelect('product.name', 'name')
            .addSelect('SUM(saleItem.total_profit)', 'totalProfit')
            .groupBy('product.id')
            .orderBy('totalProfit', 'DESC')
            .limit(limit)
            .getRawMany()
    }

    static async getSalesTrend(period = '7d') {
        return this.saleRepo
            .createQueryBuilder('sale')
            .select('DATE(sale.created_at)', 'label')
            .addSelect('SUM(sale.total_amount)', 'value')
            .groupBy('DATE(sale.created_at)')
            .orderBy('DATE(sale.created_at)', 'ASC')
            .getRawMany()
    }

    static async getExpenseTrend(period = '7d') {
        return this.expenseRepo
            .createQueryBuilder('expense')
            .select('DATE(expense.created_at)', 'label')
            .addSelect('SUM(expense.amount)', 'value')
            .groupBy('DATE(expense.created_at)')
            .orderBy('DATE(expense.created_at)', 'ASC')
            .getRawMany()
    }
}
