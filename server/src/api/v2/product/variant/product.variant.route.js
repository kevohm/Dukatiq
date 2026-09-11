import express from 'express';
import * as ProductVariantController from './product.variant.controller.js';

const router = express.Router();

router.post('/generate-sku', ProductVariantController.generateSku)
router.get('/', ProductVariantController.getAll);
router.get('/:id', ProductVariantController.getProductVariant);
router.post('/', ProductVariantController.createProductVariant);
router.put('/:id', ProductVariantController.updateProductVariant);
router.delete("/:id", ProductVariantController.deleteProductVariant)

export default router;