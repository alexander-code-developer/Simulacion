import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  runAndSaveSimulation,
  getLatestSimulation,
  getSimulationHistory,
  getSimulationById
} from '../controllers/simulationController.js';

const router = express.Router();

router.post('/run', protect, runAndSaveSimulation);
router.get('/latest', protect, getLatestSimulation);
router.get('/history', protect, getSimulationHistory);
router.get('/:id', protect, getSimulationById);

export default router;