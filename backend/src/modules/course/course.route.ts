import { Router } from 'express';
import * as courseController from './course.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, courseController.createCourse);
router.put('/:id', authMiddleware, adminMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, courseController.deleteCourse);

export default router;
