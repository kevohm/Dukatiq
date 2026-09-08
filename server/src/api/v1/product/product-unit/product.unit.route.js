import express from 'express';
import * as productUnitController from './product.unit.controller.js';

const router = express.Router();

router.get('/all/:productId', productUnitController.getAllByProduct);
router.get('/all/:productId/:unitId', productUnitController.getAllByProductAndUnit)
router.get('/base/:productId', productUnitController.getBaseProductUnit)
router.get('/:id', productUnitController.getProductUnit)
router.post('/', productUnitController.createProductUnit);
router.put('/:id', productUnitController.updateProductUnit)
router.delete("/:id", productUnitController.deleteProductUnit)

export default router;