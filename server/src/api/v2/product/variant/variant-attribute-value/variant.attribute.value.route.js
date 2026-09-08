import express from 'express'
import * as VariantAttributeValueController from './variant.attribute.value.controller.js'

const router = express.Router()

router.get('/:variant_id/:attribute_value_id', VariantAttributeValueController.getVariantAttributeValue)

router.post('/', VariantAttributeValueController.createVariantAttributeValue)

router.delete('/:variant_id/:attribute_value_id',VariantAttributeValueController.deleteVariantAttributeValue)

export default router
