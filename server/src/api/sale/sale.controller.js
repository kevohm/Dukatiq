import { SaleService } from './sale.service.js'
import { StatusCodes } from 'http-status-codes'


export const createSale = async (req, res, next) => {

        const sale = await SaleService.createSale(req.body)

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: sale,
        })

}

export const getAllSales = async (req, res, next) => {
    const data = await SaleService.getAll()

    res.status(StatusCodes.OK).json({
        success: true,
        data
    })
}

export const getSale = async (req, res, next) => {
    const sale = await SaleService.getById(req.params.id)

    res.status(StatusCodes.OK).json({
        success: true,
        data: sale,
    })
}
