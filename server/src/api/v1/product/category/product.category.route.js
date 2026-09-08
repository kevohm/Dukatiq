import express from 'express';
import * as productCategoryController from './product.category.controller.js';

const router = express.Router();

router.get('/', productCategoryController.getAll);
router.get('/:id', productCategoryController.getCategory);
router.post('/', productCategoryController.createCategory);
router.put('/:id', productCategoryController.updateCategory);
router.delete("/:id", productCategoryController.deleteCategory)

export default router;