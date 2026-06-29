
import { ExpenseCategoryService } from './expense.category.service.js'
import { StatusCodes } from 'http-status-codes'


export const getAll = async (req, res) => {
     const response = await ExpenseCategoryService.findMany()

     res.status(response.status).json({
         success: response.success,
         data: response.data,
         message: response.message,
     })
}
export const getCategory = async (req, res) => {
    const response = await ExpenseCategoryService.findById(req.params.id)

     res.status(response.status).json({
         success: response.success,
         data: response.data,
         message: response.message,
     })
}

export const createCategory = async (req, res) => {
    const response = await ExpenseCategoryService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateCategory = async (req, res) => {
    const response = await ExpenseCategoryService.update(req.params.id, req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteCategory = async (req, res) => {
    const response = await ExpenseCategoryService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
