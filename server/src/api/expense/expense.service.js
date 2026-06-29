import { StatusCodes } from 'http-status-codes'
import { ExpenseRepository } from './expense.repository.js'
import { ExpenseValidator } from './expense.validator.js'

export class ExpenseService {
    static async findMany() {
        return ExpenseRepository.getAll()
    }

    static async findById(id) {
        const expense = await ExpenseRepository.getById(id)
        if (!expense) {
            return {
                status: StatusCodes.NOT_FOUND,
                success: false,
                message: 'Expense not found',
            }
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
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to update expense',
            }
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
