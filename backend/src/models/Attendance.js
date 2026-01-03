import pool from '../config/database.js';

class Attendance {
  static async create(attendanceData) {
    const { employee_id, date, check_in_time, status, remarks } = attendanceData;

    const [result] = await pool.execute(
      `INSERT INTO attendance (employee_id, date, check_in_time, status, remarks)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       check_in_time = VALUES(check_in_time),
       status = VALUES(status),
       remarks = VALUES(remarks)`,
      [employee_id, date, check_in_time, status || 'Present', remarks]
    );

    return result.insertId || await this.findByEmployeeAndDate(employee_id, date);
  }

  static async checkOut(employee_id, date, check_out_time) {
    const attendance = await this.findByEmployeeAndDate(employee_id, date);
    
    if (!attendance) {
      throw new Error('No check-in record found');
    }

    const checkIn = new Date(`${date} ${attendance.check_in_time}`);
    const checkOut = new Date(`${date} ${check_out_time}`);
    const hours = (checkOut - checkIn) / (1000 * 60 * 60);

    await pool.execute(
      `UPDATE attendance 
       SET check_out_time = ?, total_hours = ?, status = CASE 
         WHEN ? < 4 THEN 'Half-day' 
         ELSE 'Present' 
       END
       WHERE employee_id = ? AND date = ?`,
      [check_out_time, hours.toFixed(2), hours, employee_id, date]
    );

    return await this.findByEmployeeAndDate(employee_id, date);
  }

  static async findByEmployeeAndDate(employee_id, date) {
    const [attendance] = await pool.execute(
      `SELECT a.*, e.first_name, e.last_name 
       FROM attendance a
       JOIN employees e ON a.employee_id = e.id
       WHERE a.employee_id = ? AND a.date = ?`,
      [employee_id, date]
    );
    return attendance[0] || null;
  }

  static async findByEmployee(employee_id, startDate, endDate) {
    const [attendance] = await pool.execute(
      `SELECT a.*, e.first_name, e.last_name 
       FROM attendance a
       JOIN employees e ON a.employee_id = e.id
       WHERE a.employee_id = ? AND a.date BETWEEN ? AND ?
       ORDER BY a.date DESC`,
      [employee_id, startDate, endDate]
    );
    return attendance;
  }

  static async findAll(startDate, endDate, employee_id = null) {
    let query = `SELECT a.*, e.first_name, e.last_name, e.department 
                 FROM attendance a
                 JOIN employees e ON a.employee_id = e.id
                 WHERE a.date BETWEEN ? AND ?`;
    const params = [startDate, endDate];

    if (employee_id) {
      query += ' AND a.employee_id = ?';
      params.push(employee_id);
    }

    query += ' ORDER BY a.date DESC, e.first_name';

    const [attendance] = await pool.execute(query, params);
    return attendance;
  }

  static async update(employee_id, date, attendanceData) {
    const fields = [];
    const values = [];

    Object.keys(attendanceData).forEach(key => {
      if (attendanceData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(attendanceData[key]);
      }
    });

    if (fields.length === 0) return null;

    values.push(employee_id, date);

    await pool.execute(
      `UPDATE attendance SET ${fields.join(', ')} WHERE employee_id = ? AND date = ?`,
      values
    );

    return await this.findByEmployeeAndDate(employee_id, date);
  }
}

export default Attendance;

