import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import PageHeader from '../../ui/PageHeader';
import fakeDocImage from '../../../fake_doc.png';
import ESignModal from './ESignModal';

const ReviewAndSign: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [signatureName, setSignatureName] = useState('');
  const [showESignModal, setShowESignModal] = useState(false);
  
  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  
  // For demo purposes, using the first owner's name as the signer
  const signerName = 'Peter Parker';
  const isSignatureComplete = signatureName.toLowerCase().trim() === 'peter parker';

  // Debug logging
  console.log('Signature validation:', {
    signatureName,
    signerName,
    isSignatureComplete,
    trimmedSignature: signatureName.toLowerCase().trim(),
    trimmedSigner: signerName.toLowerCase().trim(),
    currentList,
    currentListLength: currentList?.length,
    firstItem: currentList?.[0]
  });

  const handleBack = () => {
    navigate('/verification-method');
  };

  const handleContinue = () => {
    if (isSignatureComplete) {
      navigate('/success');
    }
  };

  const handlePreviewClick = () => {
    setShowESignModal(true);
  };

  const handleESignComplete = () => {
    setShowESignModal(false);
    // Could navigate to success or show completion message
  };

  const handleESignClose = () => {
    setShowESignModal(false);
  };

  return (
    <div className="review-sign-page">
      {/* Top Navigation */}
      <div className="review-sign-header">
        <div className="header-left">
          <button className="btn-back-icon" onClick={handleBack}>
            ←
          </button>
          <div className="header-divider" />
        </div>
        <div className="header-title">
          <h2>Verify ownership</h2>
        </div>
      </div>

      <div className="review-sign-content">
        {/* Main Content */}
        <div className="modal-content">
          <div className="content-section">
            <button className="btn-back" onClick={handleBack}>
              ← Back
            </button>

            <PageHeader
              title="Review and sign"
              description={isDirectors 
                ? "This document confirms your business's Directors - all individuals who serve as directors of the business."
                : "This document confirms your business's Beneficial Owners - all individuals who own more than 25% of the business."
              }
            />

            <div className="document-section">
              <div className="document-container">
                <div className="document-file-header">
                  <div className="document-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 2C3 1.44772 3.44772 1 4 1H9L13 5V14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14V2Z" stroke="#596171" strokeWidth="1.5" fill="none"/>
                      <path d="M9 1V5H13" stroke="#596171" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                  <span className="document-title">{isDirectors ? "Director attestation" : "Beneficial Owner attestation"}</span>
                </div>

                {/* Document Preview */}
                <div 
                  className="document-preview" 
                  onClick={handlePreviewClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePreviewClick();
                    }
                  }}
                >
                  <div className="document-preview-content">
                    <img 
                      src={fakeDocImage} 
                      alt={isDirectors ? "Director attestation document" : "Beneficial Owner attestation document"}
                      className="document-image"
                    />
                  </div>
                </div>

                {/* Signature Section */}
                <div className="signature-section">
                  <div className="signature-field-container">
                    <div className="signature-label">
                      To be signed by <strong>Peter Parker</strong>
                    </div>
                    
                    <div className="signature-input-wrapper">
                      <div className="signature-input-container">
                        <div className="signature-box">
                          <input
                            type="text"
                            placeholder=""
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            className="signature-input"
                          />
                          <div className="signature-line"></div>
                          <div className="signature-instruction">
                            Enter 'Peter Parker' to sign
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="disclaimer-text">
                By electronically signing this form, you will officially attest to the accuracy of your company's ownership information.{' '}
                <a href="#" className="support-link">View support article</a>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!isSignatureComplete}
              className="btn btn-primary btn-full-width btn-standalone"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <ESignModal
        isOpen={showESignModal}
        onClose={handleESignClose}
        onComplete={handleESignComplete}
      />
    </div>
  );
};

export default ReviewAndSign;