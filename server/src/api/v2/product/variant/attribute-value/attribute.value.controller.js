import { AttributeValueService } from './attribute.value.service.js'
import { StatusCodes } from 'http-status-codes'

export const getAll = async (req, res) => {
    const response = await AttributeValueService.findMany()
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
export const getAttributeValue = async (req, res) => {
    const response = await AttributeValueService.findById(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createAttributeValue = async (req, res) => {
    const response = await AttributeValueService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export const updateAttributeValue = async (req, res) => {
    const response = await AttributeValueService.update(
        req.params.id,
        req.body
    )
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const deleteAttributeValue = async (req, res) => {
    const response = await AttributeValueService.remove(req.params.id)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
