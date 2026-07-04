import { StatusCodes } from 'http-status-codes'
import { ExpenseRepository } from './expense.repository.js'
import { ExpenseValidator } from './expense.validator.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

export class ExpenseService {
    static async findMany() {
        const data = await ExpenseRepository.getAll()
        return {
            status: StatusCodes.OK,
            success: true,
            data,
            message: 'Expenses found',
        }
    }

    static async findById(id) {
        const expense = await ExpenseRepository.getById(id)
        if (!expense) {
            throw new AppError({
                message: 'Expense not found',
                code: ERROR_CODES.EXPENSE.NOT_FOUND,
                status: StatusCodes.NOT_FOUND,
                meta: { resource: 'expense', id },
            })
        }
        return {
            status: StatusCodes.OK,
            success: true,
            data: expense,
            message: 'Expense found',
        }
    }
    static async add(body, transaction = null) {
        const data = await ExpenseValidator.createSchema.parseAsync(body)

        const expense = await ExpenseRepository.create(data, transaction)

        return {
            status: StatusCodes.CREATED,
            success: true,
            data: expense,
            message: 'Successfully added',
        }
    }
    static async update(id, body) {
        const expense = await this.findById(id)

        const data = await ExpenseValidator.updateSchema.parseAsync(body)

        const result = await ExpenseRepository.update(id, data)
        if (result[0] === 0) {
            throw new AppError({
                message: 'Failed to update expense',
                code: ERROR_CODES.EXPENSE.UPDATE_FAILED,
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                meta: { resource: 'expense', id },
            })
        }
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: expense,
            message: 'Expense updated',
        }
    }

    static async remove(id) {
        const expense = await this.findById(id)
        await ExpenseRepository.delete(id)
        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            data: expense,
            message: 'Expense deleted',
        }
    }
}
