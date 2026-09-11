import { InventoryService } from './inventory.service.js'
import { StatusCodes } from 'http-status-codes'

// 🔹 Get all inventory logs
export const getAllInventory = async (req, res) => {
    const data = await InventoryService.findMany()

    res.json({
        success: true,
        data,
    })
}

// 🔹 Get stock summary for a product
export const getStock = async (req, res) => {
    const response = await InventoryService.getStock(req.params.productId)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
    })
}

// 🔹 Stock IN (restock)
export const stockIn = async (req, res) => {
    const response = await InventoryService.stockIn(req.body)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

// 🔹 Stock OUT (sales)
export const stockOut = async (req, res) => {
    const response = await InventoryService.stockOut(req.body)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

// 🔹 Manual adjustment
export const adjustStock = async (req, res) => {
    const response = await InventoryService.adjust(req.body)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

