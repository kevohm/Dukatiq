import express from 'express';
import * as expenseController from './expense.controller.js';

const router = express.Router();

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpense);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense)
// router.patch('/:id/stock', expenseController.updateStock);

export default router;