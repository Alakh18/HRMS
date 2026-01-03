import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { leaveService } from '../services/leaveService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import '../styles/Leave.css';

const Leave = () => {
  const { user, isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState({
    leave_type: 'Paid',
    start_date: '',
    end_date: '',
    remarks: ''
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await leaveService.getAll(statusFilter || null)
        : await leaveService.getMyLeaves(statusFilter || null);
      setLeaves(response.leaveRequests || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await leaveService.create(formData);
      setShowModal(false);
      setFormData({
        leave_type: 'Paid',
        start_date: '',
        end_date: '',
        remarks: ''
      });
      fetchLeaves();
      alert('Leave request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting leave request');
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status, comments = '') => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) {
      return;
    }

    setProcessing(true);
    try {
      await leaveService.updateStatus(leaveId, status, comments);
      fetchLeaves();
      setSelectedLeave(null);
      alert(`Leave request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating leave status');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Pending: 'status-pending',
      Approved: 'status-approved',
      Rejected: 'status-rejected'
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <Layout>
      <div className="leave-page">
        <div className="page-header">
          <h1>{isAdmin ? 'Leave Management' : 'My Leave Requests'}</h1>
          {!isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Apply for Leave
            </button>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
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
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="no-data">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave.id}>
                      {isAdmin && (
                        <td>
                          {leave.first_name} {leave.last_name}
                        </td>
                      )}
                      <td>{leave.leave_type}</td>
                      <td>{formatDate(leave.start_date)}</td>
                      <td>{formatDate(leave.end_date)}</td>
                      <td>{leave.total_days}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </button>
                        {isAdmin && leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                              className="btn btn-sm btn-success"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                              className="btn btn-sm btn-danger"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Apply for Leave</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Leave Type</label>
                  <select
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={(e) =>
                      setFormData({ ...formData, leave_type: e.target.value })
                    }
                    required
                  >
                    <option value="Paid">Paid</option>
                    <option value="Sick">Sick</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Personal">Personal</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedLeave && (
          <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Leave Details</h2>
              <div className="leave-details">
                {isAdmin && (
                  <div className="detail-row">
                    <span className="detail-label">Employee:</span>
                    <span className="detail-value">
                      {selectedLeave.first_name} {selectedLeave.last_name}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Leave Type:</span>
                  <span className="detail-value">{selectedLeave.leave_type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">{formatDate(selectedLeave.start_date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">End Date:</span>
                  <span className="detail-value">{formatDate(selectedLeave.end_date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Days:</span>
                  <span className="detail-value">{selectedLeave.total_days}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span
                    className={`status-badge ${getStatusBadgeClass(selectedLeave.status)}`}
                  >
                    {selectedLeave.status}
                  </span>
                </div>
                {selectedLeave.remarks && (
                  <div className="detail-row">
                    <span className="detail-label">Remarks:</span>
                    <span className="detail-value">{selectedLeave.remarks}</span>
                  </div>
                )}
                {selectedLeave.admin_comments && (
                  <div className="detail-row">
                    <span className="detail-label">Admin Comments:</span>
                    <span className="detail-value">{selectedLeave.admin_comments}</span>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setSelectedLeave(null)}
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

export default Leave;

