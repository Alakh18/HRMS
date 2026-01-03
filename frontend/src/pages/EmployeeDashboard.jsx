import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, leavesRes] = await Promise.all([
          attendanceService.getTodayAttendance(),
          leaveService.getMyLeaves('Pending')
        ]);

        setTodayAttendance(attendanceRes.attendance);
        setPendingLeaves(leavesRes.leaveRequests?.length || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      const result = await attendanceService.checkIn();
      setTodayAttendance(result.attendance);
      alert('Checked in successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await attendanceService.checkOut();
      setTodayAttendance(result.attendance);
      alert('Checked out successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    }
  };

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
          <h1>Welcome, {user?.employee?.first_name || user?.email}!</h1>
          <p>Employee Dashboard</p>
        </div>

        <div className="dashboard-cards">
          <Link to="/profile" className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>View and edit your profile</p>
          </Link>

          <Link to="/attendance" className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Attendance</h3>
            <p>Track your attendance</p>
          </Link>

          <Link to="/leave" className="dashboard-card">
            <div className="card-icon">🏖️</div>
            <h3>Leave Requests</h3>
            <p>Apply and manage leaves</p>
            {pendingLeaves > 0 && <span className="card-badge">{pendingLeaves}</span>}
          </Link>

          <Link to="/payroll" className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Payroll</h3>
            <p>View salary and payslips</p>
          </Link>
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Quick Check-in/out</h3>
            {todayAttendance?.check_in_time ? (
              <div>
                <p>Checked in at: {todayAttendance.check_in_time.substring(0, 5)}</p>
                {!todayAttendance.check_out_time && (
                  <button onClick={handleCheckOut} className="btn btn-secondary">
                    Check Out
                  </button>
                )}
                {todayAttendance.check_out_time && (
                  <p>Checked out at: {todayAttendance.check_out_time.substring(0, 5)}</p>
                )}
              </div>
            ) : (
              <button onClick={handleCheckIn} className="btn btn-primary">
                Check In
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;

