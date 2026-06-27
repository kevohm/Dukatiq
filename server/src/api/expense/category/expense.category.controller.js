
import { ExpenseCategoryService } from './expense.category.service.js'
import { StatusCodes } from 'http-status-codes'


export const getAll = async (req, res) => {
    const expenses = await ExpenseCategoryService.findMany()
    res.json({ success: true, data: expenses })
}
export const getCategory = async (req, res) => {
    const expense = await ExpenseCategoryService.findById(req.params.id)
    res.json({ success: true, data: expense })
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
