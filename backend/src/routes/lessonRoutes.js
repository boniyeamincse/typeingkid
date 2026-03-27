import express from 'express';
import {
  createLesson,
  getAllLessonsAdmin,
  updateLesson,
  deleteLesson,
  getLessonsByDifficulty,
  getLesson,
  saveLessonProgress,
  getLessonProgress,
} from '../controllers/lessonController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Admin routes (require JWT + is_admin flag) ──────────────────────────────
router.post('/', protect, admin, createLesson);
router.get('/admin', protect, admin, getAllLessonsAdmin);
router.put('/:id', protect, admin, updateLesson);
router.delete('/:id', protect, admin, deleteLesson);

// ── Protected user routes ───────────────────────────────────────────────────
router.get('/', protect, getLessonsByDifficulty);          // ?difficulty=beginner
router.get('/:id', protect, getLesson);
router.post('/:id/progress', protect, saveLessonProgress);
router.get('/:id/progress', protect, getLessonProgress);

export default router;
