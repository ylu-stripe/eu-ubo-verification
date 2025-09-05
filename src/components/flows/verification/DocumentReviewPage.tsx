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
    
        
        <h1 className="review-title">We're reviewing your documents</h1>
       
        <p className="review-description">
          Our team will review your submitted documents within 1-2 business days. 
          We'll send you an email once the review is complete.
        </p>

        <div className="review-timeline">
        
          
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