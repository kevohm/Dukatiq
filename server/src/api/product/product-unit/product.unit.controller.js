import { ProductUnitService } from './product.unit.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAllByProduct = async (req, res) => {
    const params = {
        product_id: req.params?.productId,
    }
    const response = await ProductUnitService.findManyByProduct(params)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const getAllByProductAndUnit = async (req, res) => {
    const params = {
        product_id: req.params?.productId,
        unit_id: req.params?.unitId,
    }
    const response = await ProductUnitService.findManyByProductAndUnit(params)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getBaseProductUnit = async (req, res) => {
    const params = {
        product_id: req.params?.productId,
    }
    const response = await ProductUnitService.findBaseUnit(params)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const getProductUnit = async (req, res) => {
    const response = await ProductUnitService.findById(req.params?.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createProductUnit = async (req, res) => {
    const response = await ProductUnitService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateProductUnit = async (req, res) => {
    const response = await ProductUnitService.update(req.params.id, req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteProductUnit = async (req, res) => {
    const response = await ProductUnitService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
