import { sequelize } from '../../config/database.js'
import { SaleRepository } from './sale.repository.js'
import { SaleItem } from './saleItem/sale.item.model.js'
import { Product } from '../product/product.model.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

export class SaleService {
    static async createSale({ items, payment_method }) {
        const t = await sequelize.transaction()

        try {
            let total_amount = 0
            let total_profit = 0

            const sale = await SaleRepository.create(
                {
                    total_amount: 0,
                    total_profit: 0,
                },
                t
            )

            for (const item of items) {
                const product = await Product.findByPk(item.product_id, {
                    transaction: t,
                    lock: t.LOCK.UPDATE,
                })

                if (!product) {
                    throw new AppError({
                        message: `Product not found: ${item.product_id}`,
                        code: ERROR_CODES.PRODUCT.NOT_FOUND,
                        status: 404,
                    })
                }

                if (product.stock_quantity < item.quantity) {
                    throw new AppError({
                        message: `Insufficient stock for ${product.name}`,
                        code: ERROR_CODES.PRODUCT.INSUFFICIENT_STOCK,
                        status: 400,
                    })
                }

                const selling_price =
                    item.selling_price ?? product.selling_price

                const cost_price = product.cost_price ?? 0

                const profit = (selling_price - cost_price) * item.quantity

                const line_total = selling_price * item.quantity

                await SaleItem.create(
                    {
                        sale_id: sale.id,
                        product_id: product.id,
                        quantity: item.quantity,
                        selling_price,
                        cost_price,
                        profit,
                    },
                    { transaction: t }
                )

                await product.decrement(
                    { stock_quantity: item.quantity },
                    { transaction: t }
                )

                total_amount += line_total
                total_profit += profit
            }

            await SaleRepository.update(
                sale.id,
                { total_amount, total_profit },
                t
            )

            await t.commit()

            return sale
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    static async getAll() {
        const sales = await SaleRepository.getAll()

        return {
            count: sales.length,
            data: sales,
        }
    }

    static async getById(id) {
        const sale = await SaleRepository.findById(id)

        if (!sale) {
            throw new AppError({
                message: 'Sale not found',
                code: ERROR_CODES.SALE?.NOT_FOUND || 'SALE_NOT_FOUND',
                status: 404,
                meta: { sale_id: id },
            })
        }

        return sale
    }
}
