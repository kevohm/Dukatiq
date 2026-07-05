import { sequelize } from '../../config/database.js'
import { SaleRepository } from './sale.repository.js'
import { SaleItem } from './saleItem/sale.item.model.js'
import { Product } from '../product/product.model.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { SaleValidator } from './sale.validator.js'
import { ProductUnitService } from '../product/product-unit/product.unit.service.js'
import { ProductUnitRepository } from '../product/product-unit/product.unit.repository.js'

export class SaleService {
    static async createSale(body) {
        const { items, payment_method } =
            await SaleValidator.createSchema.parseAsync(body)
        let total_amount = 0
        let total_profit = 0

        const enrichedItems = []

        for (const item of items) {
            const product = await Product.findByPk(item.product_id)

            if (!product) {
                throw new AppError({
                    message: `Product not found: ${item.product_id}`,
                    code: ERROR_CODES.PRODUCT.NOT_FOUND,
                    status: 404,
                })
            }

            const productUnit = await ProductUnitRepository.getByUnit(
                item?.product_id,
                item?.unit_id
            )

            if (!productUnit) {
                throw new AppError({
                    message: `Invalid unit for product`,
                    code: ERROR_CODES.PRODUCT.INVALID_UNIT,
                    status: 400,
                })
            }
            const factor = productUnit.conversion_factor

            const requestedStock = item.quantity * factor

            if (product.stock_quantity < requestedStock) {
                throw new AppError({
                    message: `Insufficient stock for ${product.name}`,
                    code: ERROR_CODES.PRODUCT.INSUFFICIENT_STOCK,
                    status: 400,
                })
            }

            //TODO: Unit-aware pricing (BEST PRACTICE: store on ProductUnit)
            const selling_price = product.selling_price * factor
            const cost_price = product.cost_price * factor

            const line_total = selling_price * item.quantity
            const profit = (selling_price - cost_price) * item.quantity

            enrichedItems.push({
                product_id: product.id,
                unit_id: item?.unit_id,
                quantity: item.quantity,
                normalized_quantity: requestedStock,
                selling_price,
                cost_price,
                profit,
            })

            total_amount += line_total
            total_profit += profit
        }
        const sale = await SaleRepository.create({
            payment_method,
            totals: {
                total_amount,
                total_profit,
            },
            items: enrichedItems,
        })
        return sale
    }

    static async getAll() {
        const sales = await SaleRepository.getAll()

        return sales
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
