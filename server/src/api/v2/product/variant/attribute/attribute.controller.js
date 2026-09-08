import { AttributeService } from './attribute.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAll = async (req, res) => {
    const response = await AttributeService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getAttribute = async (req, res) => {
    const response = await AttributeService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createAttribute = async (req, res) => {
    const response = await AttributeService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateAttribute = async (req, res) => {
    const response = await AttributeService.update(
        req.params.id,
        req.body
    )
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteAttribute = async (req, res) => {
    const response = await AttributeService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
