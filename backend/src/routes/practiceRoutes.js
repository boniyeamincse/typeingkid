import express from 'express';
import {
  getPracticeItems,
  savePracticeResult,
  getMyPracticeResults,
  getMyBestResults,
  createPracticeItem,
  deletePracticeItem,
} from '../controllers/practiceController.js';
import { protect, authorizeRoles, ROLE } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public item lookup (Protected user) ──────────────────────────────────────
router.get('/items', protect, getPracticeItems);            // ?type=letter|two_letter|three_letter

// ── User result routes ───────────────────────────────────────────────────────
router.post('/results', protect, savePracticeResult);
router.get('/results/me/best', protect, getMyBestResults);
router.get('/results/me', protect, getMyPracticeResults);  // ?practice_type=&limit=

// ── Admin item management ────────────────────────────────────────────────────
router.post('/items', protect, authorizeRoles(ROLE.ADMIN), createPracticeItem);
router.delete('/items/:id', protect, authorizeRoles(ROLE.ADMIN), deletePracticeItem);

export default router;
