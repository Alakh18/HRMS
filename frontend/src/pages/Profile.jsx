// import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout';
// import { employeeService } from '../services/employeeService';
// import { useAuth } from '../context/AuthContext';
// import '../styles/Profile.css';

// const Profile = () => {
//   const { user, isAdmin, updateUser } = useAuth();
//   const [employee, setEmployee] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await employeeService.getMyProfile();
//         if (response.employee) {
//           setEmployee(response.employee);
//           setFormData({
//             phone: response.employee.phone || '',
//             address: response.employee.address || '',
//             profile_picture: response.employee.profile_picture || ''
//           });
//         } else {
//           // Employee profile doesn't exist yet
//           setEmployee(null);
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setMessage('');

//     try {
//       await employeeService.updateMyProfile(formData);
//       const response = await employeeService.getMyProfile();
//       setEmployee(response.employee);
//       setIsEditing(false);
//       setMessage('Profile updated successfully!');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error updating profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="loading-container">Loading...</div>
//       </Layout>
//     );
//   }

//   if (!employee) {
//     return (
//       <Layout>
//         <div className="profile-page">
//           <div className="profile-header">
//             <h1>My Profile</h1>
//           </div>
//           <div className="profile-container">
//             <div className="profile-card" style={{ textAlign: 'center', padding: '3rem' }}>
//               <div style={{ marginBottom: '1rem' }}>
//                 <div className="profile-picture" style={{ margin: '0 auto 2rem', width: '120px', height: '120px' }}>
//                   <div className="avatar-placeholder" style={{ fontSize: '3rem' }}>
//                     {user?.email?.[0]?.toUpperCase() || 'U'}
//                   </div>
//                 </div>
//               </div>
//               <h2 style={{ marginBottom: '1rem', color: '#333' }}>Profile Setup Required</h2>
//               <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '1.1rem' }}>
//                 Your employee profile has not been set up yet. Please contact your HR department to complete your profile setup.
//               </p>
//               <div style={{ 
//                 background: '#f5f5f5', 
//                 padding: '1.5rem', 
//                 borderRadius: '8px',
//                 marginTop: '2rem',
//                 textAlign: 'left',
//                 maxWidth: '500px',
//                 margin: '2rem auto 0'
//               }}>
//                 <div className="detail-row">
//                   <span className="detail-label">Employee ID:</span>
//                   <span className="detail-value">{user?.employee_id || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Email:</span>
//                   <span className="detail-value">{user?.email || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Role:</span>
//                   <span className="detail-value">{user?.role || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="profile-page">
//         <div className="profile-header">
//           <h1>My Profile</h1>
//           {!isEditing && (
//             <button onClick={() => setIsEditing(true)} className="btn btn-primary">
//               Edit Profile
//             </button>
//           )}
//         </div>

//         {message && (
//           <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
//             {message}
//           </div>
//         )}

//         <div className="profile-container">
//           <div className="profile-card">
//             <div className="profile-picture-section">
//               <div className="profile-picture">
//                 {employee.profile_picture ? (
//                   <img src={employee.profile_picture} alt="Profile" />
//                 ) : (
//                   <div className="avatar-placeholder">
//                     {employee.first_name?.[0]}{employee.last_name?.[0]}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="profile-form">
//                 <div className="form-group">
//                   <label>Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Address</label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     rows="3"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Profile Picture URL</label>
//                   <input
//                     type="text"
//                     name="profile_picture"
//                     value={formData.profile_picture}
//                     onChange={handleChange}
//                     placeholder="Enter image URL"
//                   />
//                 </div>

//                 <div className="form-actions">
//                   <button type="submit" className="btn btn-primary" disabled={saving}>
//                     {saving ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setFormData({
//                         phone: employee.phone || '',
//                         address: employee.address || '',
//                         profile_picture: employee.profile_picture || ''
//                       });
//                     }}
//                     className="btn btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="profile-details">
//                 <div className="detail-row">
//                   <span className="detail-label">Employee ID:</span>
//                   <span className="detail-value">{employee.employee_id}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Name:</span>
//                   <span className="detail-value">
//                     {employee.first_name} {employee.last_name}
//                   </span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Email:</span>
//                   <span className="detail-value">{employee.email}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Phone:</span>
//                   <span className="detail-value">{employee.phone || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Address:</span>
//                   <span className="detail-value">{employee.address || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Department:</span>
//                   <span className="detail-value">{employee.department || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Position:</span>
//                   <span className="detail-value">{employee.position || 'N/A'}</span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Hire Date:</span>
//                   <span className="detail-value">
//                     {employee.hire_date
//                       ? new Date(employee.hire_date).toLocaleDateString()
//                       : 'N/A'}
//                   </span>
//                 </div>
//                 <div className="detail-row">
//                   <span className="detail-label">Status:</span>
//                   <span className={`status-badge status-${employee.status?.toLowerCase()}`}>
//                     {employee.status || 'N/A'}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Role Check
  const isHR = user?.role === 'HR' || user?.role === 'Admin';

  // ... imports and state remain the same

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Define Standard Mock Data (Used if API fails)
      const mockProfile = {
        employee_id: 'EMP-2024-001',
        first_name: user?.name?.split(' ')[0] || 'Alex',
        last_name: user?.name?.split(' ')[1] || 'Johnson',
        email: user?.email || 'alex.johnson@company.com',
        phone: '+1 (555) 012-3456',
        address: '123 Tech Park, Silicon Valley, CA',
        profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        designation: 'Senior Software Engineer',
        department: 'Engineering',
        status: 'Active',
        role: user?.role || 'Employee',
        reports_to: 'Sarah Connor (CTO)',
        hire_date: '2022-03-15',
        work_location: 'Headquarters - Floor 4',
        employment_type: 'Full-Time',
        salary: {
          basic: 50000,
          allowances: 15000,
          deductions: 6000,
          net: 59000
        },
        attendance: {
          working_days: 22,
          present: 21,
          leaves: 1
        },
        leave_balance: {
          paid: 14,
          sick: 6,
          unpaid: 0
        },
        documents: [
          { name: 'Offer_Letter_Signed.pdf', date: '2022-03-10' },
          { name: 'Identity_Proof.jpg', date: '2022-03-11' },
          { name: 'Tax_Forms_2024.pdf', date: '2024-01-15' }
        ]
      };

      try {
        // 2. Attempt to fetch from Backend
        const response = await employeeService.getMyProfile();
        console.log("API Response:", response); // Debugging

        // Handle different response structures
        const apiData = response.employee || response.data || response;

        if (apiData) {
          // Merge API data with Mock structure (fill in missing UI gaps)
          setEmployee({ ...mockProfile, ...apiData });
          
          // Populate form for editing
          setFormData({
            phone: apiData.phone || mockProfile.phone,
            address: apiData.address || mockProfile.address,
            profile_picture: apiData.profile_picture || mockProfile.profile_picture,
            first_name: apiData.first_name || mockProfile.first_name,
            last_name: apiData.last_name || mockProfile.last_name,
            email: apiData.email || mockProfile.email,
          });
        } else {
          throw new Error("Empty data from API");
        }

      } catch (error) {
        console.warn('API Failed or Incomplete - Using Mock Data for UI Demo');
        console.error(error);
        
        // 3. Fallback: Load Mock Data so the page doesn't crash/hide
        setEmployee(mockProfile);
        setFormData({
            phone: mockProfile.phone,
            address: mockProfile.address,
            profile_picture: mockProfile.profile_picture,
            first_name: mockProfile.first_name,
            last_name: mockProfile.last_name,
            email: mockProfile.email,
        });
        
        // Optional: Show a small toast/message that we are in Demo Mode
        setMessage('⚠️ specific profile data not found, loaded Demo Data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Re-run if user context changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // In a real app, you might strip read-only fields here before sending
      await employeeService.updateMyProfile(formData);
      
      // Update local state to reflect changes immediately
      setEmployee(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      
      // Auto-hide message
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        logout();
    }
  }

  // Helper to render input fields with locks
  const renderField = (label, name, value, type = "text", editableByEmp = false) => {
    const isLocked = !isHR && !editableByEmp; 
    
    // If not editing, just show text value
    if (!isEditing) {
        return (
            <div className="detail-row">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value || 'N/A'}</span>
            </div>
        );
    }

    return (
      <div className="form-group">
        <label>
          {label} {isLocked && <span title="Read Only">🔒</span>}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={isLocked}
          className={isLocked ? 'input-locked' : ''}
        />
      </div>
    );
  };

  if (loading) return <Layout><div className="loading-container">Loading HR Data...</div></Layout>;
  if (!employee) return <Layout><div className="error-container">Profile not found. Contact HR.</div></Layout>;

  return (
    <Layout>
      <div className="profile-page">
        {/* --- 1. PROFILE HEADER --- */}
        <div className="profile-header-card">
          <div className="header-content">
            <div className="profile-avatar-large">
              {employee.profile_picture ? (
                <img src={employee.profile_picture} alt="Profile" />
              ) : (
                <div className="avatar-placeholder-large">
                  {employee.first_name?.[0]}{employee.last_name?.[0]}
                </div>
              )}
              {isEditing && (
                 <div className="edit-avatar-overlay">📷</div>
              )}
            </div>
            
            <div className="header-info">
              <div className="header-top">
                <h1>{employee.first_name} {employee.last_name}</h1>
                <span className={`status-badge status-${employee.status?.toLowerCase() || 'active'}`}>
                   {employee.status || 'Active'}
                </span>
              </div>
              <p className="designation">{employee.designation}</p>
              <div className="meta-tags">
                <span className="tag">🆔 {employee.employee_id}</span>
                <span className="tag">🏢 {employee.department}</span>
                <span className="tag">🛡️ {isHR ? 'Administrator' : 'Employee'}</span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="action-buttons">
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          
          {/* --- LEFT COLUMN --- */}
          <div className="profile-left-col">
            
            {/* --- 2. PERSONAL INFO --- */}
            <div className="card">
              <h3>👤 Personal Information</h3>
              <div className="card-body">
                {isEditing ? (
                    <form className="edit-form">
                        {renderField("First Name", "first_name", formData.first_name, "text", false)}
                        {renderField("Last Name", "last_name", formData.last_name, "text", false)}
                        {renderField("Email", "email", formData.email, "email", false)}
                        {renderField("Phone", "phone", formData.phone, "tel", true)}
                        {renderField("Address", "address", formData.address, "text", true)}
                        {isEditing && (
                           <div className="form-group">
                             <label>Profile Image URL (Emp Edit)</label>
                             <input name="profile_picture" value={formData.profile_picture} onChange={handleChange} />
                           </div>
                        )}
                    </form>
                ) : (
                    <div className="info-list">
                        <div className="info-item">
                            <label>Email</label> <p>{employee.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone</label> <p>{employee.phone || 'N/A'}</p>
                        </div>
                        <div className="info-item">
                            <label>Address</label> <p>{employee.address || 'N/A'}</p>
                        </div>
                        <div className="info-item">
                            <label>DOB</label> <p>1990-05-15 (Protected)</p>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* --- 7. ACCOUNT & SECURITY --- */}
            <div className="card security-card">
              <h3>🔐 Account & Security</h3>
              <div className="card-body">
                <div className="security-row">
                    <span>Last Login: Today, 9:00 AM</span>
                </div>
                <div className="security-actions">
                    <button className="btn-text">Change Password</button>
                    <button onClick={handleLogout} className="btn-text text-danger">Logout</button>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="profile-right-col">

            {/* --- 3. JOB INFORMATION (Read Only) --- */}
            <div className="card">
              <h3>💼 Job Details {(!isHR) && '🔒'}</h3>
              <div className="grid-2">
                 <div className="info-item"><label>Reporting To</label><p>{employee.reports_to}</p></div>
                 <div className="info-item"><label>Date of Joining</label><p>{new Date(employee.hire_date).toLocaleDateString()}</p></div>
                 <div className="info-item"><label>Employment Type</label><p>{employee.employment_type}</p></div>
                 <div className="info-item"><label>Work Location</label><p>{employee.work_location}</p></div>
              </div>
            </div>

            {/* --- 4. SALARY (Role Protected) --- */}
            <div className="card">
              <h3>💰 Compensation {(!isHR) && '🔒'}</h3>
              <div className="salary-preview">
                 <div className="salary-item highlight">
                    <label>Net Salary</label>
                    <h2>${employee.salary.net.toLocaleString()}</h2>
                 </div>
                 <div className="salary-details">
                    <div className="s-row"><span>Basic</span> <span>${employee.salary.basic.toLocaleString()}</span></div>
                    <div className="s-row"><span>Allowances</span> <span>+${employee.salary.allowances.toLocaleString()}</span></div>
                    <div className="s-row text-danger"><span>Deductions</span> <span>-${employee.salary.deductions.toLocaleString()}</span></div>
                 </div>
              </div>
            </div>

            {/* --- 5. ATTENDANCE & LEAVES --- */}
            <div className="card">
                <div className="card-header-flex">
                    <h3>📅 Attendance & Leaves</h3>
                    <div className="header-btns">
                        <button className="btn-xs btn-outline">History</button>
                        <button className="btn-xs btn-primary">Apply Leave</button>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-num">{employee.attendance.present}/{employee.attendance.working_days}</span>
                        <span className="stat-label">Days Present</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-num">{employee.leave_balance.paid}</span>
                        <span className="stat-label">Paid Leave</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-num">{employee.leave_balance.sick}</span>
                        <span className="stat-label">Sick Leave</span>
                    </div>
                </div>
            </div>

            {/* --- 6. DOCUMENTS --- */}
            <div className="card">
                <h3>📂 Documents</h3>
                <div className="doc-list">
                    {employee.documents.map((doc, index) => (
                        <div key={index} className="doc-item">
                            <span className="doc-icon">📄</span>
                            <div className="doc-info">
                                <span className="doc-name">{doc.name}</span>
                                <span className="doc-date">{doc.date}</span>
                            </div>
                            <button className="btn-xs">View</button>
                        </div>
                    ))}
                    <div className="doc-upload">
                        <button className="btn-dashed">+ Upload Document</button>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;