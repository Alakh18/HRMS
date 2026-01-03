import pool from '../config/database.js';

class Payroll {
  static async create(payrollData) {
    const {
      employee_id, month, year, basic_salary, allowances, deductions,
      bonus, total_salary, net_salary, payment_status
    } = payrollData;

    const [result] = await pool.execute(
      `INSERT INTO payroll 
       (employee_id, month, year, basic_salary, allowances, deductions, bonus, 
        total_salary, net_salary, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       basic_salary = VALUES(basic_salary),
       allowances = VALUES(allowances),
       deductions = VALUES(deductions),
       bonus = VALUES(bonus),
       total_salary = VALUES(total_salary),
       net_salary = VALUES(net_salary),
       payment_status = VALUES(payment_status)`,
      [employee_id, month, year, basic_salary, allowances || 0, deductions || 0,
       bonus || 0, total_salary, net_salary, payment_status || 'Pending']
    );

    return result.insertId || await this.findByEmployeeAndMonth(employee_id, month, year);
  }

  static async findByEmployeeAndMonth(employee_id, month, year) {
    const [payroll] = await pool.execute(
      `SELECT p.*, e.first_name, e.last_name, e.department
       FROM payroll p
       JOIN employees e ON p.employee_id = e.id
       WHERE p.employee_id = ? AND p.month = ? AND p.year = ?`,
      [employee_id, month, year]
    );
    return payroll[0] || null;
  }

  static async findByEmployee(employee_id, year = null) {
    let query = `SELECT p.*, e.first_name, e.last_name, e.department
                 FROM payroll p
                 JOIN employees e ON p.employee_id = e.id
                 WHERE p.employee_id = ?`;
    const params = [employee_id];

    if (year) {
      query += ' AND p.year = ?';
      params.push(year);
    }

    query += ' ORDER BY p.year DESC, p.month DESC';

    const [payroll] = await pool.execute(query, params);
    return payroll;
  }

  static async findAll(month = null, year = null) {
    let query = `SELECT p.*, e.first_name, e.last_name, e.department, e.email
                 FROM payroll p
                 JOIN employees e ON p.employee_id = e.id
                 WHERE 1=1`;
    const params = [];

    if (month) {
      query += ' AND p.month = ?';
      params.push(month);
    }

    if (year) {
      query += ' AND p.year = ?';
      params.push(year);
    }

    query += ' ORDER BY p.year DESC, p.month DESC, e.first_name';

    const [payroll] = await pool.execute(query, params);
    return payroll;
  }

  static async update(id, payrollData) {
    const fields = [];
    const values = [];

    Object.keys(payrollData).forEach(key => {
      if (payrollData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(payrollData[key]);
      }
    });

    if (fields.length === 0) return null;

    values.push(id);

    await pool.execute(
      `UPDATE payroll SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [payroll] = await pool.execute(
      'SELECT * FROM payroll WHERE id = ?',
      [id]
    );
    return payroll[0] || null;
  }
}

export default Payroll;

