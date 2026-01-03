import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {

  // ===============================
  // CREATE USER
  // ===============================
  static async create({ employee_id, email, password, role = 'Employee' }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (employee_id, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [employee_id, email, hashedPassword, role]
    );

    return result.insertId;
  }

  // ===============================
  // FIND BY EMAIL
  // ===============================
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length ? rows[0] : null;
  }

  // ===============================
  // FIND BY EMPLOYEE ID
  // ===============================
  static async findByEmployeeId(employee_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE employee_id = ? LIMIT 1',
      [employee_id]
    );
    return rows.length ? rows[0] : null;
  }

  // ===============================
  // FIND BY USER ID
  // ===============================
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, employee_id, email, role, is_verified, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  // ===============================
  // VERIFY PASSWORD
  // ===============================
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // ===============================
  // UPDATE PASSWORD
  // ===============================
  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return true;
  }
}

export default User;
