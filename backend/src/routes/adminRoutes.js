import express from 'express';
import { listUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, authorizeRoles, ROLE } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles(ROLE.ADMIN));

router.get('/users', listUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;
