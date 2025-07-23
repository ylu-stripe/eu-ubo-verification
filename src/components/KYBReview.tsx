import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

const KYBReview: React.FC = () => {
  const navigate = useNavigate();
  const { shouldShowUBO } = useUBO();

  const handleBackToDashboard = () => {
    navigate('/ash');
  };

  return (
    <Modal title="Verify business information">
      <div className="document-review-page">
        <div className="review-icon">
          🏢
        </div>
        
        <h1 className="review-title">We're reviewing your business information</h1>
        <h2 className="review-subtitle">
          Your business verification is being processed
        </h2>
        <p className="review-description">
          Our team will review your submitted business information within 1-2 business days. 
          We'll send you an email once the review is complete.
        </p>

        <div className="review-timeline">
          <div className="timeline-item completed">
            <div className="timeline-icon">✅</div>
            <div className="timeline-content">
              <div className="timeline-title">Information submitted</div>
              <div className="timeline-time">Just now</div>
            </div>
          </div>
          
          <div className="timeline-item pending">
            <div className="timeline-icon">⏳</div>
            <div className="timeline-content">
              <div className="timeline-title">Under review</div>
              <div className="timeline-time">1-2 business days</div>
            </div>
          </div>
          
          <div className="timeline-item future">
            <div className="timeline-icon">📧</div>
            <div className="timeline-content">
              <div className="timeline-title">Review complete</div>
              <div className="timeline-time">Email notification</div>
            </div>
          </div>
        </div>

        <div className="review-details">
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value pending">Under Review</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Review time:</span>
            <span className="detail-value">1-2 business days</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">
              <a href="mailto:support@example.com" className="inline-link">
                support@example.com
              </a>
            </span>
          </div>
        </div>

        {!shouldShowUBO() && (
          <div className="review-note">
            <p className="note-text">
              <strong>Next steps:</strong> Once your business verification is approved, you'll be able to proceed with beneficial ownership verification.
            </p>
          </div>
        )}

        <button
          onClick={handleBackToDashboard}
          className="btn btn-primary btn-full-width"
        >
          Back to Dashboard
        </button>
      </div>
    </Modal>
  );
};

export default KYBReview; 