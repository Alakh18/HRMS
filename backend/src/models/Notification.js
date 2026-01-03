import pool from '../config/database.js';

class Notification {
  static async create(notificationData) {
    const { user_id, title, message, type, link } = notificationData;

    const [result] = await pool.execute(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, message, type || 'Info', link]
    );

    return result.insertId;
  }

  static async findByUser(user_id, filters = {}) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [user_id];

    if (filters.is_read !== undefined) {
      query += ' AND is_read = ?';
      params.push(filters.is_read);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(filters.limit || 50);

    const [notifications] = await pool.execute(query, params);
    return notifications;
  }

  static async markAsRead(id, user_id) {
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
  }

  static async markAllAsRead(user_id) {
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [user_id]
    );
  }

  static async getUnreadCount(user_id) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [user_id]
    );
    return result[0].count;
  }

  static async delete(id, user_id) {
    await pool.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
  }
}

export default Notification;

