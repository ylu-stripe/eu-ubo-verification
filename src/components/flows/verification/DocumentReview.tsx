import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import ESignModal from './ESignModal';

const DocumentReview: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [showESignModal, setShowESignModal] = useState(false);

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const documentTitle = isDirectors ? 'Corporate Structure Disclosure' : 'Beneficial Ownership Disclosure';
  const listType = isDirectors ? 'directors and executives' : 'beneficial owners';

  const handleBack = () => {
    navigate('/verification-method');
  };

  const handleContinue = () => {
    setShowESignModal(true);
  };

  const handleESignComplete = () => {
    navigate('/review-attestation');
  };

  const handleCancel = () => {
    navigate('/verification-method');
  };

  return (
    <>
      <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
        <button className="btn-back mb-24" onClick={handleBack}>
          ← Back
        </button>

        <h1 className="page-title">Review and electronically sign</h1>
        <p className="page-description">
          This document captures your {listType}. By electronically signing this form, you will officially attest to the accuracy of your company's {isDirectors ? 'corporate structure' : 'ownership'} information.{' '}
          <a href="#" className="inline-link">
            View support article
          </a>
        </p>

        <div className="mb-32">
          <h3 className="section-title">{documentTitle}</h3>
          
          <div className="document-preview">
            <div className="document-header">
              <div className="document-title">{documentTitle}</div>
              <div className="document-subtitle">Form required by {isDirectors ? 'corporate governance' : 'anti-money laundering'} regulations</div>
            </div>
            
            <div className="document-content">
              <div className="document-line">
                {isDirectors 
                  ? 'Directors and executives are senior individuals who significantly influence your organization and corporate governance.'
                  : 'Beneficial owner is any individual who, directly or indirectly, exercises ownership or control over the company.'
                }
              </div>
              <div className="document-line"></div>
              <div className="document-line">
                I hereby certify that the information contained in this report accurately reflects the {isDirectors ? 'corporate structure and leadership' : 'beneficial ownership'} of the company as of the date below and that I have read and understand the statement on accuracy of reports.
              </div>
            </div>
            
            <div className="document-signature">
              <div className="signature-line">
                <span className="signature-label">Your signature</span>
              </div>
              <div className="document-date">July 14, 2025</div>
            </div>
          </div>
        </div>

        <div className="flex-column-gap">
          <button onClick={handleCancel} className="btn btn-secondary btn-full-width">
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="btn btn-primary btn-full-width"
          >
            Review and e-sign
          </button>
        </div>
      </Modal>

      <ESignModal 
        isOpen={showESignModal}
        onClose={() => setShowESignModal(false)}
        onComplete={handleESignComplete}
      />
    </>
  );
};

export default DocumentReview; 