import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getInventory,
  createProduct,
  updateProduct,
  toggleProductActive,
  registerMovement,
  applySimulationPolicies,
  getSystemConfig,
  updateSystemConfig
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/config', protect, getSystemConfig);
router.put('/config', protect, updateSystemConfig);

router.get('/', protect, getInventory);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.patch('/:id/toggle', protect, toggleProductActive);
router.post('/:id/movement', protect, registerMovement);
router.post('/apply-policies', protect, applySimulationPolicies);

export default router;