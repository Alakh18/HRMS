import pool from '../config/database.js';

class Employee {
  static async create(employeeData) {
    const {
      user_id, first_name, last_name, phone, address, date_of_birth,
      gender, profile_picture, department, position, hire_date, employment_type
    } = employeeData;

    const [result] = await pool.execute(
      `INSERT INTO employees 
       (user_id, first_name, last_name, phone, address, date_of_birth, gender, 
        profile_picture, department, position, hire_date, employment_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, first_name, last_name, phone, address, date_of_birth, gender,
       profile_picture, department, position, hire_date, employment_type || 'Full-time']
    );

    return result.insertId;
  }

  static async findById(id) {
    const [employees] = await pool.execute(
      `SELECT e.*, u.email, u.employee_id, u.role 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.id = ?`,
      [id]
    );
    return employees[0] || null;
  }

  static async findByUserId(userId) {
    const [employees] = await pool.execute(
      `SELECT e.*, u.email, u.employee_id, u.role 
       FROM employees e 
       JOIN users u ON e.user_id = u.id 
       WHERE e.user_id = ?`,
      [userId]
    );
    return employees[0] || null;
  }

  static async findAll(filters = {}) {
    let query = `SELECT e.*, u.email, u.employee_id, u.role 
                 FROM employees e 
                 JOIN users u ON e.user_id = u.id 
                 WHERE 1=1`;
    const params = [];

    if (filters.department) {
      query += ' AND e.department = ?';
      params.push(filters.department);
    }

    if (filters.status) {
      query += ' AND e.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY e.created_at DESC';

    const [employees] = await pool.execute(query, params);
    return employees;
  }

  static async update(id, employeeData) {
    const fields = [];
    const values = [];

    Object.keys(employeeData).forEach(key => {
      if (employeeData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(employeeData[key]);
      }
    });

    if (fields.length === 0) return null;

    values.push(id);

    await pool.execute(
      `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
  }
}

export default Employee;

