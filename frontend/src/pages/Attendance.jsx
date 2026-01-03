import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import { getStartOfMonth, getEndOfMonth, formatDate } from '../utils/formatDate';
import '../styles/Attendance.css';

const Attendance = () => {
  const { isAdmin } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);

  // ✅ MONTH RANGE (IMPORTANT)
  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(getEndOfMonth());

  const [loading, setLoading] = useState(true);

  // 🔁 force refresh after check-in / out
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAttendance();
    fetchTodayAttendance();
  }, [startDate, endDate, refreshKey]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await attendanceService.getAll(startDate, endDate)
        : await attendanceService.getMyAttendance(startDate, endDate);

      setAttendance(response.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!isAdmin) {
      try {
        const response = await attendanceService.getTodayAttendance();
        setTodayAttendance(response.attendance);
      } catch (error) {
        console.error('Error fetching today attendance:', error);
      }
    }
  };

  const handleCheckIn = async () => {
    try {
      const result = await attendanceService.checkIn();
      setTodayAttendance(result.attendance);
      setRefreshKey((prev) => prev + 1); // 🔁 refresh table
      alert('Checked in successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await attendanceService.checkOut();
      setTodayAttendance(result.attendance);
      setRefreshKey((prev) => prev + 1); // 🔁 refresh table
      alert('Checked out successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Present: 'status-present',
      Absent: 'status-absent',
      'Half-day': 'status-halfday',
      Leave: 'status-leave',
      Holiday: 'status-holiday'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <Layout>
      <div className="attendance-page">
        <div className="page-header">
          <h1>Attendance</h1>

          {!isAdmin && (
            <div className="check-in-out">
              {todayAttendance?.check_in_time ? (
                <div className="attendance-status">
                  <p>
                    Checked in at:{' '}
                    {todayAttendance.check_in_time.substring(0, 5)}
                  </p>

                  {!todayAttendance.check_out_time && (
                    <button
                      onClick={handleCheckOut}
                      className="btn btn-secondary"
                    >
                      Check Out
                    </button>
                  )}

                  {todayAttendance.check_out_time && (
                    <p>
                      Checked out at:{' '}
                      {todayAttendance.check_out_time.substring(0, 5)}
                    </p>
                  )}
                </div>
              ) : (
                <button onClick={handleCheckIn} className="btn btn-primary">
                  Check In
                </button>
              )}
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                  {isAdmin && <th>Remarks</th>}
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 5} className="no-data">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr key={record.id}>
                      {isAdmin && (
                        <td>
                          {record.first_name} {record.last_name}
                        </td>
                      )}
                      <td>{formatDate(record.date)}</td>
                      <td>
                        {record.check_in_time
                          ? record.check_in_time.substring(0, 5)
                          : '-'}
                      </td>
                      <td>
                        {record.check_out_time
                          ? record.check_out_time.substring(0, 5)
                          : '-'}
                      </td>
                      <td>{record.total_hours || '-'}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      {isAdmin && <td>{record.remarks || '-'}</td>}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
