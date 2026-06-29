import { sequelize } from '../../config/database.js'
import { ExpenseService } from './expense.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAllExpenses = async (req, res) => {
    const response = await ExpenseService.findMany()
     res.status(response.status).json({
         success: response.success,
         data: response.data,
         message: response.message,
     })
}
export const getExpense = async (req, res) => {
    const response = await ExpenseService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const createExpense = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const response = await ExpenseService.add(req.body, t)
        await t.commit()
        res.status(response.status).json({
            success: response.success,
            data: response?.data,
            message: response?.message,
        })
    } catch (error) {
        await t.rollback()
        throw error
    }
}

export const updateExpense = async (req, res) => {
    const response = await ExpenseService.update(req.params.id, req.body)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteExpense = async (req, res) => {
    const response = await ExpenseService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

// export const updateStock = (req, res) => {
//   try {
//     const { stock, change_type } = req.body;
//     if (stock === undefined) {
//       return res.status(400).json({ success: false, error: 'Stock value is required' });
//     }
//     const expense = ExpenseRepository.updateStock(req.params.id, stock, change_type || 'adjustment');
//     if (!expense) {
//       return res.status(404).json({ success: false, error: 'Expense not found' });
//     }
//     res.json({ success: true, data: expense });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
