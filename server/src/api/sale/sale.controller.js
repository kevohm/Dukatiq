import { SaleService } from './sale.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * CREATE SALE
 */
export const createSale = async (req, res, next) => {
    try {
        const sale = await SaleService.createSale(req.body)

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: sale,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * GET ALL SALES
 */
export const getAllSales = async (req, res, next) => {
    try {
        const result = await SaleService.getAllSales()

        res.status(StatusCodes.OK).json({
            success: true,
            count: result.count,
            data: result.data,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * GET SINGLE SALE
 */
export const getSale = async (req, res, next) => {
    try {
        const sale = await SaleService.getSaleById(req.params.id)

        res.status(StatusCodes.OK).json({
            success: true,
            data: sale,
        })
    } catch (error) {
        next(error)
    }
}
