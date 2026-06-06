import { Router } from 'express';
import * as collegeController from './college.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

router.get('/', collegeController.getColleges);
router.get('/states', collegeController.getStates);
router.get('/cities', collegeController.getCities);
router.get('/:id', collegeController.getCollegeById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, collegeController.createCollege);
router.put('/:id', authMiddleware, adminMiddleware, collegeController.updateCollege);
router.delete('/:id', authMiddleware, adminMiddleware, collegeController.deleteCollege);

export default router;
