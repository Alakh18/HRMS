import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, isAdmin, updateUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await employeeService.getMyProfile();
        setEmployee(response.employee);
        setFormData({
          phone: response.employee.phone || '',
          address: response.employee.address || '',
          profile_picture: response.employee.profile_picture || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await employeeService.updateMyProfile(formData);
      const response = await employeeService.getMyProfile();
      setEmployee(response.employee);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">Loading...</div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="error-container">Employee profile not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-picture-section">
              <div className="profile-picture">
                {employee.profile_picture ? (
                  <img src={employee.profile_picture} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input
                    type="text"
                    name="profile_picture"
                    value={formData.profile_picture}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        phone: employee.phone || '',
                        address: employee.address || '',
                        profile_picture: employee.profile_picture || ''
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Employee ID:</span>
                  <span className="detail-value">{employee.employee_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {employee.first_name} {employee.last_name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{employee.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{employee.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{employee.address || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{employee.department || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Position:</span>
                  <span className="detail-value">{employee.position || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Hire Date:</span>
                  <span className="detail-value">
                    {employee.hire_date
                      ? new Date(employee.hire_date).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${employee.status?.toLowerCase()}`}>
                    {employee.status || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

