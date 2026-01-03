import pool from '../config/database.js';

class SalaryStructure {
  static async create(salaryData) {
    const {
      employee_id, basic_salary, hra, transport_allowance, medical_allowance,
      other_allowances, tax_deduction, other_deductions, effective_from
    } = salaryData;

    // Deactivate old structure
    await pool.execute(
      'UPDATE salary_structure SET is_active = FALSE, effective_to = ? WHERE employee_id = ? AND is_active = TRUE',
      [new Date(effective_from), employee_id]
    );

    const [result] = await pool.execute(
      `INSERT INTO salary_structure 
       (employee_id, basic_salary, hra, transport_allowance, medical_allowance,
        other_allowances, tax_deduction, other_deductions, effective_from)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, basic_salary, hra || 0, transport_allowance || 0, medical_allowance || 0,
       other_allowances || 0, tax_deduction || 0, other_deductions || 0, effective_from]
    );

    return result.insertId;
  }

  static async findByEmployee(employee_id) {
    const [structures] = await pool.execute(
      `SELECT * FROM salary_structure 
       WHERE employee_id = ? AND is_active = TRUE
       ORDER BY effective_from DESC
       LIMIT 1`,
      [employee_id]
    );
    return structures[0] || null;
  }

  static async update(employee_id, salaryData) {
    const structure = await this.findByEmployee(employee_id);
    
    if (!structure) {
      return await this.create({ ...salaryData, employee_id, effective_from: new Date() });
    }

    const fields = [];
    const values = [];

    Object.keys(salaryData).forEach(key => {
      if (salaryData[key] !== undefined && key !== 'employee_id') {
        fields.push(`${key} = ?`);
        values.push(salaryData[key]);
      }
    });

    if (fields.length === 0) return structure;

    values.push(employee_id);

    await pool.execute(
      `UPDATE salary_structure SET ${fields.join(', ')} WHERE employee_id = ? AND is_active = TRUE`,
      values
    );

    return await this.findByEmployee(employee_id);
  }
}

export default SalaryStructure;

