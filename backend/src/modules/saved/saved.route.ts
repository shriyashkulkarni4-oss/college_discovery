import { Router } from 'express';
import * as savedController from './saved.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', savedController.getSavedColleges);
router.get('/ids', savedController.getSavedIds);
router.post('/:collegeId', savedController.saveCollege);
router.delete('/:collegeId', savedController.unsaveCollege);

export default router;
