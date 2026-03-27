import express from 'express';
import {
  createClassroom,
  listClassrooms,
  addStudentToClassroom,
  assignLessonToClassroom,
  getClassroomReport,
} from '../controllers/educatorController.js';
import { protect, authorizeRoles, ROLE } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles(ROLE.EDUCATOR, ROLE.ADMIN));

router.post('/classes', createClassroom);
router.get('/classes', listClassrooms);
router.post('/classes/:id/students', addStudentToClassroom);
router.post('/classes/:id/assignments', assignLessonToClassroom);
router.get('/classes/:id/reports', getClassroomReport);

export default router;
