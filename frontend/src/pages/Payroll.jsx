import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { payrollService } from '../services/payrollService';
import { useAuth } from '../context/AuthContext';
import '../styles/Payroll.css';

const Payroll = () => {
  const { user, isAdmin } = useAuth();
  const [payroll, setPayroll] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, [year, month]);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await payrollService.getAll(year, month)
        : await payrollService.getMyPayroll(year, month);
      setPayroll(response.payroll || []);
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1];
  };

  return (
    <Layout>
      <div className="payroll-page">
        <div className="page-header">
          <h1>{isAdmin ? 'Payroll Management' : 'My Payroll'}</h1>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Month:</label>
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="2020"
              max={new Date().getFullYear() + 1}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : payroll.length === 0 ? (
          <div className="no-data-container">No payroll records found</div>
        ) : (
          <div className="payroll-container">
            {payroll.map((record) => (
              <div
                key={record.id}
                className="payroll-card"
                onClick={() => setSelectedPayroll(record)}
              >
                <div className="payroll-header">
                  <h3>
                    {isAdmin
                      ? `${record.first_name} ${record.last_name}`
                      : `${getMonthName(record.month)} ${record.year}`}
                  </h3>
                  <span
                    className={`status-badge status-${record.payment_status?.toLowerCase()}`}
                  >
                    {record.payment_status}
                  </span>
                </div>
                <div className="payroll-body">
                  <div className="payroll-row">
                    <span>Net Salary:</span>
                    <strong>₹{record.net_salary?.toLocaleString()}</strong>
                  </div>
                  <div className="payroll-row">
                    <span>Basic Salary:</span>
                    <span>₹{record.basic_salary?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPayroll && (
          <div className="modal-overlay" onClick={() => setSelectedPayroll(null)}>
            <div className="modal-content payroll-details" onClick={(e) => e.stopPropagation()}>
              <h2>Payroll Details</h2>
              <div className="payroll-detail-section">
                {isAdmin && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Employee:</span>
                      <span className="detail-value">
                        {selectedPayroll.first_name} {selectedPayroll.last_name}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{selectedPayroll.department}</span>
                    </div>
                  </>
                )}
                <div className="detail-row">
                  <span className="detail-label">Period:</span>
                  <span className="detail-value">
                    {getMonthName(selectedPayroll.month)} {selectedPayroll.year}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Basic Salary:</span>
                  <span className="detail-value">₹{selectedPayroll.basic_salary?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Allowances:</span>
                  <span className="detail-value">₹{selectedPayroll.allowances?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Bonus:</span>
                  <span className="detail-value">₹{selectedPayroll.bonus?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Deductions:</span>
                  <span className="detail-value">₹{selectedPayroll.deductions?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Salary:</span>
                  <span className="detail-value">₹{selectedPayroll.total_salary?.toLocaleString()}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">Net Salary:</span>
                  <span className="detail-value">₹{selectedPayroll.net_salary?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Status:</span>
                  <span
                    className={`status-badge status-${selectedPayroll.payment_status?.toLowerCase()}`}
                  >
                    {selectedPayroll.payment_status}
                  </span>
                </div>
                {selectedPayroll.payment_date && (
                  <div className="detail-row">
                    <span className="detail-label">Payment Date:</span>
                    <span className="detail-value">
                      {new Date(selectedPayroll.payment_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setSelectedPayroll(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payroll;

