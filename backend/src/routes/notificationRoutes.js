import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;

