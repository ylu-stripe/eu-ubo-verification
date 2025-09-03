import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import ESignModal from './ESignModal';
import PageHeader from '../../ui/PageHeader';

const ReviewAttestation: React.FC = () => {
  const navigate = useNavigate();
  const { isDirectorsFlow } = useUBO();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showESignModal, setShowESignModal] = useState(false);

  const isDirectors = isDirectorsFlow();

  const handleBack = () => {
    navigate('/document-review');
  };

  const handleSubmit = () => {
    // Navigate to success page after submission
    navigate('/success');
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  const handleClose = () => {
    setIsDeleted(false);
  };

  const handleSignDocument = () => {
    // Open the e-sign modal
    setShowESignModal(true);
  };

  const handleESignComplete = () => {
    // After signing, restore the signed state and close modal
    setIsDeleted(false);
    setShowESignModal(false);
  };

  const handleESignClose = () => {
    setShowESignModal(false);
  };

  return (
    <>
      <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
        <button className="btn-back mb-24" onClick={handleBack}>
          ← Back
        </button>

        <div className="content-section">
          <PageHeader
            title="Review attestation"
            description="Make sure everything looks right"
          />

          <div className="document-preview mb-32">
            <div className="document-header">
              <div className="document-info">
                <div className="document-icon">📄</div>
                <span className="document-name">attestation.pdf</span>
              </div>
              {!isDeleted ? (
                <button onClick={handleDelete} className="btn btn-secondary btn-small">
                  Delete
                </button>
              ) : (
                <button onClick={handleClose} className="btn-close-document">
                  ×
                </button>
              )}
            </div>
            
            <div className="document-preview-container">
              <div className="document-image-container">
                {/* Static document image */}
                <div className="document-image">
                  <div className="doc-header">
                    <div className="doc-title">Stripe ("Stripe")</div>
                    <div className="doc-address">
                      <div>Address line 1</div>
                      <div>Address line 2</div>
                      <div>Address line 3</div>
                    </div>
                  </div>
                  
                  <div className="doc-content">
                    <div className="doc-section-title">Beneficial Owner Certified Attestation</div>
                    
                    <div className="doc-text">
                      I/We act on behalf of Stripe user [Legal name ____________] ("Business") with Business Registration Number ("BRN") or Business Address [___________________].
                    </div>
                    
                    <div className="doc-text">
                                              I hereby declare that I have listed below all beneficial owners of the Business, which includes: (a) all natural persons owning more than 25% shares/voting rights of the Business, and/or (b) all legal entities or holding companies owning more than 25% shares/voting rights of the Business, <span className="highlight-text">and the beneficial owners of any such legal entities</span>.
                    </div>
                    
                    <div className="doc-text">
                      If applicable, and where the Business is owned more than 25% by a Trust, all Trustees, Settlors, and Beneficiaries of such Trust must be identified.
                    </div>
                    
                    <div className="doc-text">
                      I hereby certify that the information contained in this report accurately reflects the beneficial ownership of the company as of the date below and that I have read and understand the statement on accuracy of reports.
                    </div>
                  </div>
                  
                  <div className="doc-signature">
                    <div className="signature-line">
                      <span className="signature-label">Your signature</span>
                    </div>
                    <div className="doc-date">July 14, 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-column-gap">
            <button onClick={handleSubmit} className="btn btn-primary btn-full-width">
              Submit
            </button>
            <button onClick={handleSignDocument} className="btn btn-secondary btn-full-width">
              Sign document
            </button>
          </div>
        </div>
      </Modal>

      <ESignModal 
        isOpen={showESignModal}
        onClose={handleESignClose}
        onComplete={handleESignComplete}
      />
    </>
  );
};

export default ReviewAttestation; 