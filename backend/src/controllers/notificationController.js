import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const { is_read, limit } = req.query;
    const filters = {};

    if (is_read !== undefined) {
      filters.is_read = is_read === 'true';
    }

    if (limit) {
      filters.limit = parseInt(limit);
    }

    const notifications = await Notification.findByUser(req.user.id, filters);

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.markAsRead(id, req.user.id);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.delete(id, req.user.id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

