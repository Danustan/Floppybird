import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import '../styles/ComplaintDetails.css';

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [authority] = useState(JSON.parse(localStorage.getItem('authority') || '{}'));

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/authority/login');
    }
    fetchComplaintDetails();
  }, [complaintId, navigate]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/complaints/${complaintId}/status`);
      setComplaint(response.data.complaint);
      setEvidence(response.data.evidence || []);
      setNewStatus(response.data.complaint.status);
    } catch (error) {
      toast.error('Failed to load complaint details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, {
        status: newStatus,
        message: '',
        authority_id: authority.id
      });
      toast.success('Complaint updated successfully');
      fetchComplaintDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
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

  if (loading) return <div className="complaint-details-container"><p>Loading...</p></div>;
  if (!complaint) return <div className="complaint-details-container"><p>Complaint not found</p></div>;

  return (
    <div className="complaint-details-container">
      <div className="complaint-header">
        <button className="back-btn" onClick={() => navigate('/authority/dashboard')}>← Back</button>
        <h1>Complaint #{complaint.id}</h1>
      </div>

      <div className="complaint-details-wrapper">
        {/* Complaint Info */}
        <div className="complaint-info-section">
          <div className="info-card">
            <h2>📋 Complaint Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Title:</label>
                <p>{complaint.title}</p>
              </div>
              <div className="info-item">
                <label>Violation Type:</label>
                <p>{complaint.violation_type}</p>
              </div>
              <div className="info-item">
                <label>Location:</label>
                <p>{complaint.location_address}</p>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  {complaint.status}
                </span>
              </div>
              <div className="info-item">
                <label>Severity:</label>
                <p>{complaint.severity || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Submitted:</label>
                <p>{new Date(complaint.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="description-box">
              <label>Description:</label>
              <p>{complaint.description}</p>
            </div>

            <div className="user-info-box">
              <h3>👤 Reporter Information</h3>
              <p><strong>Name:</strong> {complaint.user_name}</p>
              <p><strong>Email:</strong> {complaint.user_email}</p>
              <p><strong>Phone:</strong> {complaint.user_phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Evidence Section */}
        <div className="evidence-section">
          <div className="evidence-card">
            <h2>📸 Evidence ({evidence.length} files)</h2>
            
            {evidence.length === 0 ? (
              <p className="no-evidence">No evidence files uploaded</p>
            ) : (
              <div className="evidence-grid">
                {evidence.map((file, index) => (
                  <div key={index} className="evidence-item">
                    {file.file_type === 'image' ? (
                      <>
                        <img 
                          src={`http://localhost:5000${file.file_path}`}
                          alt={`Evidence ${index + 1}`}
                          className="evidence-thumbnail"
                        />
                        <p className="file-name">📷 {file.file_name || `Image ${index + 1}`}</p>
                      </>
                    ) : (
                      <>
                        <div className="video-placeholder">
                          <span>🎥</span>
                        </div>
                        <p className="file-name">📹 {file.file_name || `Video ${index + 1}`}</p>
                      </>
                    )}
                    <a 
                      href={`http://localhost:5000${file.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View Full
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Update Section */}
        <div className="status-update-section">
          <div className="update-card">
            <h2>🔄 Update Status</h2>
            
            <div className="form-group">
              <label>New Status:</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="not_viewed">Not Viewed</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="fake_report">Fake Report</option>
              </select>
            </div>

            <button 
              onClick={handleStatusUpdate}
              className="update-btn"
            >
              💾 Update Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
