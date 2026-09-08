import express from 'express';
import * as AttributeController from './attribute.value.controller.js';

const router = express.Router();

router.get('/', AttributeController.getAll);
router.get('/:id', AttributeController.getAttributeValue);
router.post('/', AttributeController.createAttributeValue);
router.put('/:id', AttributeController.updateAttributeValue);
router.delete("/:id", AttributeController.deleteAttributeValue)

export default router;