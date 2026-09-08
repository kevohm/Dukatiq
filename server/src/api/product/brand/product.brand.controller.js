import { ProductBrandService } from './product.brand.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAll = async (req, res) => {
    const response = await ProductBrandService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getBrand = async (req, res) => {
    const response = await ProductBrandService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createBrand = async (req, res) => {
    const response = await ProductBrandService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateBrand = async (req, res) => {
    const response = await ProductBrandService.update(
        req.params.id,
        req.body
    )
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteBrand = async (req, res) => {
    const response = await ProductBrandService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
