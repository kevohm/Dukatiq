import { VariantAttributeValueService } from './variant.attribute.value.service.js'
import { StatusCodes } from 'http-status-codes'

export const getVariantAttributeValue = async (req, res) => {
    const response = await VariantAttributeValueService.findByVariantIdAttributeValueId(req.params)
    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}

export const createVariantAttributeValue = async (req, res) => {
    const response = await VariantAttributeValueService.add(req.body)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}


export const deleteVariantAttributeValue = async (req, res) => {
    console.log(req.params)
    const response = await VariantAttributeValueService.remove(req.params)

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
