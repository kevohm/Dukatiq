import { StatusCodes } from 'http-status-codes'
import { InventoryRepository } from './inventory.repository.js'
import { InventoryValidator } from './inventory.validator.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { UnitService } from '../product/unit/unit.service.js'
import { ProductService } from '../product/product.service.js'
import { ProductRepository } from '../product/product.repository.js'
import { ProductUnitService } from '../product/product-unit/product.unit.service.js'
import { ProductUnitRepository } from '../product/product-unit/product.unit.repository.js'
import { calculateStockChange } from '../../utils/inventory/inventory.utils.js'
import { inventory } from '../../db/schema.js'

export function assertSufficientStock({ currentStock, change, product_id }) {
    if (currentStock + change < 0) {
        throw new AppError({
            message: 'Insufficient stock',
            code: ERROR_CODES.INVENTORY.INSUFFICIENT_STOCK,
            status: StatusCodes.BAD_REQUEST,
            meta: { resource: 'inventory', product_id },
        })
    }
}

export class InventoryService {
    // 🔹 Get all inventory logs
    static async findMany() {
        return await InventoryRepository.getAll()
    }

    // 🔹 Get stock summary for a product
    static async getStock(productId) {
        const stock = await InventoryRepository.getStock(productId)

        return {
            status: StatusCodes.OK,
            success: true,
            data: { stock },
        }
    }

    // 🔹 STOCK IN
    static async stockIn(body) {
        const data = await InventoryValidator.createSchema.parseAsync(body)

        const productUnit = await ProductUnitRepository.getByUnit(
            data?.product_id,
            data?.unit_id
        )
        // console.log(productUnit,data)
        const normalized_quantity =
            data.quantity * productUnit.conversion_factor

        const event = await InventoryRepository.create({
            ...data,
            type: 'stock_in',
            normalized_quantity,
        })

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: event,
            message: 'Stock added successfully',
        }
    }

    // 🔹 STOCK OUT
    static async stockOut(body) {
        const data = await InventoryValidator.createSchema.parseAsync(body)

        const productUnit = await ProductUnitRepository.getByUnit(
            data.product_id,
            data.unit_id
        )

        const normalized_quantity =
            data.quantity * productUnit.conversion_factor

        const change = calculateStockChange({
            type: 'stock_out',
            normalized_quantity,
        })

        const product = await ProductRepository.getById(data.product_id)

        assertSufficientStock({
            currentStock: product.stock_quantity,
            change,
            product_id: data.product_id,
        })

        const event = await InventoryRepository.create({
            ...data,
            type: 'stock_out',
            normalized_quantity,
        })

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: event,
            message: 'Stock removed successfully',
        }
    }
    // 🔹 ADJUSTMENT
    static async adjust(body) {
        const data = await InventoryValidator.adjustSchema.parseAsync(body)

        const productUnit = await ProductUnitRepository.getByUnit(
            data.product_id,
            data.unit_id
        )

        const normalized_quantity =
            data.quantity * productUnit.conversion_factor

        const change = calculateStockChange({
            type: 'adjustment',
            normalized_quantity,
            adjustment_type: data.adjustment_type,
        })

        const product = await ProductRepository.getById(data.product_id)

        assertSufficientStock({
            currentStock: product.stock_quantity,
            change,
            product_id: data.product_id,
        })

        const event = await InventoryRepository.create({
            ...data,
            type: 'adjustment',
            normalized_quantity,
        })

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: event,
            message: 'Stock adjusted successfully',
        }
    }

    static async recalculateProductStock(tx, productId) {
        return await InventoryRepository.recalculateProductStock(tx,productId)
    }
}
