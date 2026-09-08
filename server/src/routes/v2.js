import express from 'express'
import productRoutes from '../api/product/product.route.js'
import attributeRoutes from '../api/v2/product/variant/attribute/attribute.route.js'
import attributeValueRoutes from '../api/v2/product/variant/attribute-value/attribute.value.route.js'

import VariantAttributeValueRoutes from '../api/v2/product/variant/variant-attribute-value/variant.attribute.value.route.js'

import productVariantRoutes from '../api/v2/product/variant/product.variant.route.js'


const router = express.Router()

router.use('/attribute', attributeRoutes)
router.use('/attribute-value', attributeValueRoutes)
router.use('/product-variant', productVariantRoutes)
router.use('/variant-attribute-value', VariantAttributeValueRoutes)
export const v2Router = router
