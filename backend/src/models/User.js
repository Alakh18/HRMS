import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create(userData) {
    const { employee_id, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (employee_id, email, password, role) VALUES (?, ?, ?, ?)',
      [employee_id, email, hashedPassword, role || 'Employee']
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0] || null;
  }

  static async findById(id) {
    const [users] = await pool.execute(
      'SELECT id, employee_id, email, role, is_verified, created_at FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  static async findByEmployeeId(employee_id) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE employee_id = ?',
      [employee_id]
    );
    return users[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
  }
}

export default User;

