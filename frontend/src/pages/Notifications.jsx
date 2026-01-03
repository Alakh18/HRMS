import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { notificationService } from '../services/notificationService';
import { formatDateTime } from '../utils/formatDate';
import '../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAll();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await notificationService.delete(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      Success: '✓',
      Error: '✗',
      Warning: '⚠',
      Info: 'ℹ',
      Leave: '🏖️',
      Attendance: '📅',
      Payroll: '💰'
    };
    return icons[type] || '•';
  };

  return (
    <Layout>
      <div className="notifications-page">
        <div className="page-header">
          <h1>Notifications</h1>
          {notifications.some((n) => !n.is_read) && (
            <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="no-data-container">No notifications</div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatDateTime(notification.created_at)}
                  </span>
                </div>
                <div className="notification-actions">
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;

