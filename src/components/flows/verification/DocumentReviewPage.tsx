import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const DocumentReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDirectorsFlow } = useUBO();
  
  const isDirectors = isDirectorsFlow();

  const handleBackToDashboard = () => {
    navigate('/ash?manualReview=ubo');
  };

  return (
    <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
      <div className="document-review-page">
        <div className="review-icon">
          📋
        </div>
        
        <h1 className="review-title">We're reviewing your documents</h1>
        <h2 className="review-subtitle">
          {isDirectors 
            ? "Your directors documentation is being processed" 
            : "Your beneficial ownership documentation is being processed"
          }
        </h2>
        <p className="review-description">
          Our team will review your submitted documents within 1-2 business days. 
          We'll send you an email once the review is complete.
        </p>

        <div className="review-timeline">
          <div className="timeline-item completed">
            <div className="timeline-icon">✅</div>
            <div className="timeline-content">
              <div className="timeline-title">Documents uploaded</div>
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

export default DocumentReviewPage; 