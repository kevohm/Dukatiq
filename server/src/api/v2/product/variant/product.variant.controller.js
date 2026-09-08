import { ProductVariantService } from './product.variant.service.js'
import { StatusCodes } from 'http-status-codes'


export const generateSku = async (req, res) => {
    const response = await ProductVariantService.generateSku(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const getAll = async (req, res) => {
    const response = await ProductVariantService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getProductVariant = async (req, res) => {
    const response = await ProductVariantService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createProductVariant = async (req, res) => {
    const response = await ProductVariantService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateProductVariant = async (req, res) => {
    const response = await ProductVariantService.update(
        req.params.id,
        req.body
    )
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteProductVariant = async (req, res) => {
    const response = await ProductVariantService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
