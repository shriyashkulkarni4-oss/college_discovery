import { Router } from 'express';
import * as adminController from './admin.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);

export default router;
