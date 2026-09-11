import { UnitService } from './unit.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAll = async (req, res) => {
    const response = await UnitService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getUnit = async (req, res) => {
    const response = await UnitService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createUnit = async (req, res) => {
    const response = await UnitService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}


export const deleteUnit = async (req, res) => {
    const response = await UnitService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
