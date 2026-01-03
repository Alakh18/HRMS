import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { employeeService } from '../services/employeeService';
import { leaveService } from '../services/leaveService';
import { attendanceService } from '../services/attendanceService';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeavesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, leavesRes] = await Promise.all([
          employeeService.getAll(),
          leaveService.getAll('Pending')
        ]);

        setEmployees(employeesRes.employees || []);
        setPendingLeaves(leavesRes.leaveRequests || []);
        setStats({
          totalEmployees: employeesRes.employees?.length || 0,
          pendingLeavesCount: leavesRes.leaveRequests?.length || 0,
          presentToday: 0 // Would need to fetch from attendance
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="dashboard-loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage employees, attendance, and leave requests</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
          <div className="stat-card">
            <h3>{stats.presentToday}</h3>
            <p>Present Today</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingLeavesCount}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Employees</h3>
            <p>{stats.totalEmployees} total employees</p>
          </div>

          <Link to="/attendance" className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Attendance</h3>
            <p>View all attendance records</p>
          </Link>

          <Link to="/leave" className="dashboard-card">
            <div className="card-icon">✅</div>
            <h3>Leave Approvals</h3>
            <p>Approve/reject leave requests</p>
            {stats.pendingLeavesCount > 0 && (
              <span className="card-badge">{stats.pendingLeavesCount}</span>
            )}
          </Link>

          <Link to="/payroll" className="dashboard-card">
            <div className="card-icon">💵</div>
            <h3>Payroll</h3>
            <p>Manage payroll and salaries</p>
          </Link>
        </div>

        {employees.length > 0 && (
          <div className="dashboard-section">
            <h2>Employee List</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 10).map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.employee_id}</td>
                      <td>{employee.first_name} {employee.last_name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department || 'N/A'}</td>
                      <td>{employee.position || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${employee.status?.toLowerCase()}`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length > 10 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Showing 10 of {employees.length} employees
                </div>
              )}
            </div>
          </div>
        )}

        {pendingLeaves.length > 0 && (
          <div className="dashboard-section">
            <h2>Pending Leave Requests</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.slice(0, 5).map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.first_name} {leave.last_name}</td>
                      <td>{leave.leave_type}</td>
                      <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                      <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                      <td>{leave.total_days}</td>
                      <td>
                        <Link to={`/leave`} className="btn btn-sm btn-primary">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;

