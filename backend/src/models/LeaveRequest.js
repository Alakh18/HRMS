import pool from '../config/database.js';
import { calculateDaysBetween } from '../utils/helpers.js';

class LeaveRequest {
  static async create(leaveData) {
    const { employee_id, leave_type, start_date, end_date, remarks } = leaveData;
    const total_days = calculateDaysBetween(start_date, end_date);

    const [result] = await pool.execute(
      `INSERT INTO leave_requests 
       (employee_id, leave_type, start_date, end_date, total_days, remarks, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [employee_id, leave_type, start_date, end_date, total_days, remarks]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [leaves] = await pool.execute(
      `SELECT lr.*, e.first_name, e.last_name, e.department, 
              a.first_name as approver_first_name, a.last_name as approver_last_name
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       LEFT JOIN employees a ON lr.approved_by = a.id
       WHERE lr.id = ?`,
      [id]
    );
    return leaves[0] || null;
  }

  static async findByEmployee(employee_id, filters = {}) {
    let query = `SELECT lr.*, e.first_name, e.last_name, e.department,
                        a.first_name as approver_first_name, a.last_name as approver_last_name
                 FROM leave_requests lr
                 JOIN employees e ON lr.employee_id = e.id
                 LEFT JOIN employees a ON lr.approved_by = a.id
                 WHERE lr.employee_id = ?`;
    const params = [employee_id];

    if (filters.status) {
      query += ' AND lr.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY lr.created_at DESC';

    const [leaves] = await pool.execute(query, params);
    return leaves;
  }

  static async findAll(filters = {}) {
    let query = `SELECT lr.*, e.first_name, e.last_name, e.department, e.email,
                        a.first_name as approver_first_name, a.last_name as approver_last_name
                 FROM leave_requests lr
                 JOIN employees e ON lr.employee_id = e.id
                 LEFT JOIN employees a ON lr.approved_by = a.id
                 WHERE 1=1`;
    const params = [];

    if (filters.status) {
      query += ' AND lr.status = ?';
      params.push(filters.status);
    }

    if (filters.employee_id) {
      query += ' AND lr.employee_id = ?';
      params.push(filters.employee_id);
    }

    query += ' ORDER BY lr.created_at DESC';

    const [leaves] = await pool.execute(query, params);
    return leaves;
  }

  static async updateStatus(id, status, admin_comments, approved_by) {
    const updateData = {
      status,
      admin_comments,
      approved_by,
      approved_at: status !== 'Pending' ? new Date() : null
    };

    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    values.push(id);

    await pool.execute(
      `UPDATE leave_requests SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM leave_requests WHERE id = ?', [id]);
  }
}

export default LeaveRequest;

