import { Router } from 'express';
import * as reviewController from './review.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';

const router = Router();

router.post('/', authMiddleware, reviewController.createReview);
router.get('/college/:collegeId', reviewController.getReviewsByCollege);
router.get('/', authMiddleware, adminMiddleware, reviewController.getAllReviews);
router.delete('/:id', authMiddleware, adminMiddleware, reviewController.deleteReview);

export default router;
