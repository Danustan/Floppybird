import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/AuthorityDashboard.css';

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ status: '', sort: 'created_at' });
  const [loading, setLoading] = useState(true);
  const [authority] = useState(JSON.parse(localStorage.getItem('authority') || '{}'));

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/authority/login');
    }
    fetchDashboardData();
  }, [navigate, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaints', { params: filters });
      setComplaints(response.data.complaints);
      setStats(response.data.pagination);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus, message) => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus,
        message,
        authority_id: authority.id
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authority');
    navigate('/');
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'not_viewed': '#f39c12',
      'in_progress': '#3498db',
      'resolved': '#2ecc71',
      'fake_report': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Authority Dashboard</h1>
        <div className="user-info">
          <span>{authority.name} ({authority.role})</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="not_viewed">Not Viewed</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="fake_report">Fake Report</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="filter-select"
        >
          <option value="created_at">Recently Added</option>
          <option value="severity">Most Severe</option>
          <option value="proof_count">Most Evidence</option>
        </select>
      </div>

      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div className="complaints-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>#{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.violation_type}</td>
                  <td>{complaint.location_address}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusBadgeColor(complaint.status) }}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td>{complaint.proof_count} files</td>
                  <td>
                    <button
                      className="action-btn view-btn"
                      onClick={() => navigate(`/complaint/${complaint.id}`)}
                    >
                      View
                    </button>
                    <select
                      className="action-select"
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value, '')}
                      defaultValue={complaint.status}
                    >
                      <option value="">Update Status</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="fake_report">Fake Report</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;
