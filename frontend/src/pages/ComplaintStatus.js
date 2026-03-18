import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import api from '../utils/api';
import '../styles/ComplaintStatus.css';

const ComplaintStatus = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { statusUpdate } = useSocket(null);

  useEffect(() => {
    fetchComplaintStatus();
  }, [complaintId]);

  useEffect(() => {
    if (statusUpdate && statusUpdate.complaintId === parseInt(complaintId)) {
      // Update complaint status in real-time
      setComplaint(prev => ({
        ...prev,
        status: statusUpdate.status
      }));
    }
  }, [statusUpdate, complaintId]);

  const fetchComplaintStatus = async () => {
    try {
      const response = await api.get(`/complaints/${complaintId}/status`);
      setComplaint(response.data.complaint);
      setUpdates(response.data.updates);
    } catch (error) {
      console.error('Error fetching complaint status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'not_viewed': '#f39c12',
      'in_progress': '#3498db',
      'resolved': '#2ecc71',
      'fake_report': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'not_viewed': 'Not Yet Reviewed',
      'in_progress': 'Being Investigated',
      'resolved': 'Resolved',
      'fake_report': 'Not Verified'
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="status-container"><p>Loading...</p></div>;
  }

  if (!complaint) {
    return <div className="status-container"><p>Complaint not found</p></div>;
  }

  return (
    <div className="status-container">
      <div className="status-card">
        <div className="status-header">
          <h2>Complaint Status #{complaint.id}</h2>
          <div className="status-badge" style={{ backgroundColor: getStatusColor(complaint.status) }}>
            {getStatusLabel(complaint.status)}
          </div>
        </div>

        <div className="complaint-details">
          <div className="detail-row">
            <span className="label">Violation Type:</span>
            <span className="value">{complaint.violation_type}</span>
          </div>
          <div className="detail-row">
            <span className="label">Title:</span>
            <span className="value">{complaint.title}</span>
          </div>
          <div className="detail-row">
            <span className="label">Location:</span>
            <span className="value">{complaint.location_address}</span>
          </div>
          <div className="detail-row">
            <span className="label">Submitted:</span>
            <span className="value">{new Date(complaint.created_at).toLocaleDateString()}</span>
          </div>
          {complaint.authority_name && (
            <div className="detail-row">
              <span className="label">Assigned To:</span>
              <span className="value">{complaint.authority_name}</span>
            </div>
          )}
        </div>

        <div className="updates-section">
          <h3>Timeline & Updates</h3>
          {updates.length > 0 ? (
            <div className="updates-list">
              {updates.map(update => (
                <div key={update.id} className="update-item">
                  <div className="update-time">
                    {new Date(update.created_at).toLocaleString()}
                  </div>
                  <div className="update-status" style={{ backgroundColor: getStatusColor(update.status) }}>
                    {getStatusLabel(update.status)}
                  </div>
                  {update.message && (
                    <div className="update-message">{update.message}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No updates yet. Your complaint is in the review queue.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatus;
