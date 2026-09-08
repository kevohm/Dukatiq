import express from 'express';
import * as productBrandController from './product.brand.controller.js';

const router = express.Router();

router.get('/', productBrandController.getAll);
router.get('/:id', productBrandController.getBrand);
router.post('/', productBrandController.createBrand);
router.put('/:id', productBrandController.updateBrand);
router.delete("/:id", productBrandController.deleteBrand)

export default router;