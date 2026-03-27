import express from 'express';
import {
  createLesson,
  getAllLessonsAdmin,
  updateLesson,
  deleteLesson,
  getLessonsByDifficulty,
  getLessonByDifficultyAndOrder,
  getLesson,
  saveLessonProgress,
  getLessonProgress,
  getMyLessonProgressSummary,
  getMyLessonRank,
  getAdaptiveLessonSuggestion,
} from '../controllers/lessonController.js';
import { protect, authorizeRoles, ROLE } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Admin routes (global lesson management) ─────────────────────────────────
router.post('/', protect, authorizeRoles(ROLE.ADMIN), createLesson);
router.get('/admin', protect, authorizeRoles(ROLE.ADMIN), getAllLessonsAdmin);
router.put('/:id', protect, authorizeRoles(ROLE.ADMIN), updateLesson);
router.delete('/:id', protect, authorizeRoles(ROLE.ADMIN), deleteLesson);

// ── Protected user routes ───────────────────────────────────────────────────
router.get('/', protect, getLessonsByDifficulty);          // ?difficulty=beginner
router.get('/progress/summary', protect, getMyLessonProgressSummary);
router.get('/rank/me', protect, getMyLessonRank);
router.get('/difficulty/:difficulty/order/:orderIndex', protect, getLessonByDifficultyAndOrder);
router.get('/:id/adaptive-next', protect, getAdaptiveLessonSuggestion);
router.get('/:id', protect, getLesson);
router.post('/:id/progress', protect, saveLessonProgress);
router.get('/:id/progress', protect, getLessonProgress);

export default router;
