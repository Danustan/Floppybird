import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentComplaints(response.data.recentComplaints);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-container"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-container">
      <h1>🏢 Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p className="stat-value">{stats.totalComplaints}</p>
          </div>
          <div className="stat-card">
            <h3>Resolved</h3>
            <p className="stat-value" style={{ color: '#2ecc71' }}>
              {stats.byStatus?.resolved || 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-value" style={{ color: '#3498db' }}>
              {stats.byStatus?.in_progress || 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>Not Viewed</h3>
            <p className="stat-value" style={{ color: '#f39c12' }}>
              {stats.byStatus?.not_viewed || 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>Fake Reports</h3>
            <p className="stat-value" style={{ color: '#e74c3c' }}>
              {stats.byStatus?.fake_report || 0}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Authorities</h3>
            <p className="stat-value">{stats.totalAuthorities}</p>
          </div>
          <div className="stat-card">
            <h3>Departments</h3>
            <p className="stat-value">{stats.totalDepartments}</p>
          </div>
        </div>
      )}

      <div className="recent-section">
        <h2>Recent Complaints</h2>
        <table className="recent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>User</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map(complaint => (
              <tr key={complaint.id}>
                <td>#{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.violation_type}</td>
                <td>{complaint.user_name}</td>
                <td>{complaint.status}</td>
                <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
