import express from 'express'
import * as inventoryController from './inventory.controller.js'

const router = express.Router()

// 🔹 Get all inventory events
router.get('/', inventoryController.getAllInventory)

// 🔹 Get stock summary for a product
router.get('/stock/:productId', inventoryController.getStock)

// 🔹 Stock IN (restock)
router.post('/stock-in', inventoryController.stockIn)

// 🔹 Stock OUT (sales)
router.post('/stock-out', inventoryController.stockOut)

// 🔹 Manual adjustment
router.post('/adjust', inventoryController.adjustStock)



export default router
