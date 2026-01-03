import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/dashboard">HRMS</Link>
          </div>
          <ul className="nav-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/leave">Leave</Link></li>
            <li><Link to="/payroll">Payroll</Link></li>
            <li>
              <Link to="/notifications" className="notification-link">
                Notifications
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </Link>
            </li>
            <li className="user-menu">
              <span className="user-name">{user?.employee?.first_name || user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

