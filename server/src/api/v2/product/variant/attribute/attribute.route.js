import express from 'express';
import * as AttributeController from './attribute.controller.js';

const router = express.Router();

router.get('/', AttributeController.getAll);
router.get('/:id', AttributeController.getAttribute);
router.post('/', AttributeController.createAttribute);
router.put('/:id', AttributeController.updateAttribute);
router.delete("/:id", AttributeController.deleteAttribute)

export default router;