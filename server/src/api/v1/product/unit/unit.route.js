import express from 'express';
import * as unitController from './unit.controller.js';

const router = express.Router();

router.get('/', unitController.getAll);
router.get('/:id', unitController.getUnit);
router.post('/', unitController.createUnit);
router.delete("/:id", unitController.deleteUnit)

export default router;