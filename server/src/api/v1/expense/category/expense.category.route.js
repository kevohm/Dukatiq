import express from 'express';
import * as expenseCategoryController from './expense.category.controller.js';

const router = express.Router();

router.get('/', expenseCategoryController.getAll);
router.get('/:id', expenseCategoryController.getCategory);
router.post('/', expenseCategoryController.createCategory);
router.put('/:id', expenseCategoryController.updateCategory);
router.delete("/:id", expenseCategoryController.deleteCategory)

export default router;