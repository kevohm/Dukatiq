import { QueryTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Product } from './product.model.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'

export class ProductRepository {
    // Get all products
    static async getAll() {
        return Product.findAll()
    }

    // Get product by ID
    static async getById(id) {
        return await Product.findByPk(id)
    }

    // Create new product
    static async create(data, transaction = null) {
        const category = await ProductCategoryRepository.findOrCreate(
            { name: data?.category }, transaction
        )
        return await Product.create(
            {
                ...data,
                category_id: category.id,
            },
            { transaction }
        )
    }

    // Update product
    static async update(id, data) {
        const product = await Product.update(data, { where: { id } })
        return product
    }
    static async delete(id) {
        return await Product.destroy({ where: { id } })
    }

    // Update stock with audit
    static async updateStock(id, newStock, changeType = 'adjustment') {
        const product = await this.getById(id)
        if (!product) throw new Error('Product not found')

        const oldStock = product.stock

        // Update stock
        await sequelize.query(
            'UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            { replacements: [newStock, id], type: QueryTypes.UPDATE }
        )

        // Log audit
        await sequelize.query(
            `
      INSERT INTO inventory_audit (product_id, old_stock, new_stock, change_type)
      VALUES (?, ?, ?, ?)
    `,
            {
                replacements: [id, oldStock, newStock, changeType],
                type: QueryTypes.INSERT,
            }
        )

        return this.getById(id)
    }

    // Get products needing restock
    static async getRestockNeeded() {
        const sql = `
      SELECT 
        p.*,
        (p.selling_price - p.cost_price) as margin,
        (SELECT COUNT(*) FROM sales_log 
         WHERE product_id = p.id 
         AND sold_at > datetime('now', '-7 days')) as weekly_sales,
        CASE 
          WHEN p.stock <= p.min_stock * 0.3 THEN 'urgent'
          WHEN p.stock <= p.min_stock * 0.6 THEN 'soon'
          ELSE 'healthy'
        END as priority
      FROM products p
      WHERE p.stock <= p.min_stock
      ORDER BY weekly_sales DESC, margin DESC
    `
        return sequelize.query(sql, { type: QueryTypes.SELECT })
    }

    // Get profit leaders
    static async getProfitLeaders(period = '30 days') {
        const sql = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.selling_price,
        p.cost_price,
        (p.selling_price - p.cost_price) as margin,
        COUNT(s.id) as units_sold,
        SUM(s.total_revenue) as total_revenue,
        SUM(s.profit) as total_profit,
        ROUND(AVG(s.profit), 2) as avg_profit_per_unit
      FROM products p
      LEFT JOIN sales_log s ON p.id = s.product_id AND s.sale_type = 'single'
      WHERE s.sold_at IS NULL OR s.sold_at > datetime('now', '-${period}')
      GROUP BY p.id
      HAVING units_sold > 0
      ORDER BY total_profit DESC
      LIMIT 10
    `
        return sequelize.query(sql, { type: QueryTypes.SELECT })
    }

    // Get loss leaders
    static async getLossLeaders() {
        const sql = `
      SELECT 
        p.id,
        p.name,
        p.category,
        p.stock,
        p.selling_price,
        p.cost_price,
        (p.selling_price - p.cost_price) as margin,
        (SELECT COUNT(*) FROM sales_log 
         WHERE product_id = p.id 
         AND sold_at > datetime('now', '-30 days')) as sales_30d,
        CASE 
          WHEN (p.selling_price - p.cost_price) < 2 THEN '⚠️ Low Margin'
          WHEN (SELECT COUNT(*) FROM sales_log 
                WHERE product_id = p.id 
                AND sold_at > datetime('now', '-30 days')) < 3 THEN '⚠️ Slow Moving'
          ELSE '✅ Good'
        END as status
      FROM products p
      WHERE p.stock > 0
      HAVING status != '✅ Good'
      ORDER BY margin ASC, sales_30d ASC
    `
        return sequelize.query(sql, { type: QueryTypes.SELECT })
    }
    // Get category breakdown
    static getCategoryBreakdown(period = '30 days') {
        const stmt = db.prepare(`
      SELECT 
        p.category,
        COUNT(DISTINCT p.id) as product_count,
        SUM(s.total_revenue) as revenue,
        SUM(s.profit) as total_profit,
        COUNT(s.id) as units_sold,
        ROUND(SUM(s.profit) * 100.0 / (SELECT SUM(profit) FROM sales_log WHERE sold_at > datetime('now', '-${period}')), 1) as profit_percentage
      FROM products p
      LEFT JOIN sales_log s ON p.id = s.product_id
      WHERE s.sold_at IS NULL OR s.sold_at > datetime('now', '-${period}')
      GROUP BY p.category
      ORDER BY total_profit DESC
    `)
        return stmt.all()
    }
}
