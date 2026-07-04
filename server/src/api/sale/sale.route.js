import express from 'express';
import * as saleController from './sale.controller.js';

const router = express.Router();

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSale);
router.post('/', saleController.createSale);

export default router;