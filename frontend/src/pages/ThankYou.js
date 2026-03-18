import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ThankYou.css';

const ThankYou = () => {
  const navigate = useNavigate();
  const complaintId = localStorage.getItem('complaintId');

  useEffect(() => {
    if (!complaintId) {
      navigate('/');
    }
  }, [complaintId, navigate]);

  const handleCheckStatus = () => {
    navigate(`/status/${complaintId}`);
  };

  const handleNewReport = () => {
    localStorage.removeItem('complaintId');
    navigate('/report');
  };

  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Report!</h1>
        <p className="subtitle">You've helped us keep the environment clean and protected.</p>

        <div className="report-details">
          <div className="detail-item">
            <span className="label">Report ID:</span>
            <span className="value">{complaintId}</span>
          </div>
          <p className="info-text">
            Your report has been submitted successfully. Our team of authorities and environmental experts 
            will review your complaint and take appropriate action.
          </p>
          <p className="info-text">
            You'll receive updates on the status of your complaint. You can check the status anytime using your report ID.
          </p>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleCheckStatus}>
            Check Status
          </button>
          <button className="btn btn-secondary" onClick={handleNewReport}>
            Submit Another Report
          </button>
        </div>

        <div className="environmental-message">
          <p>🌍 Together, we're building a better, cleaner future!</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
