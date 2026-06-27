
import { ProductCategoryService } from './product.category.service.js'
import { StatusCodes } from 'http-status-codes'


export const getAll = async (req, res) => {
    const products = await ProductCategoryService.findMany()
    res.json({ success: true, data: products })
}
export const getCategory = async (req, res) => {
    const product = await ProductCategoryService.findById(req.params.id)
    res.json({ success: true, data: product })
}

export const createCategory = async (req, res) => {
    const response = await ProductCategoryService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateCategory = async (req, res) => {
    const response = await ProductCategoryService.update(req.params.id, req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteCategory = async (req, res) => {
    const response = await ProductCategoryService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
