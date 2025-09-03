import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import PageHeader from '../../ui/PageHeader';
import fakeDocImage from '../../../fake_doc.png';

const ReviewAndSign: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [signatureName, setSignatureName] = useState('');
  
  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  
  // For demo purposes, using the first owner's name as the signer
  const signerName = currentList[0]?.name || 'Peter Parker';
  const isSignatureComplete = signatureName.toLowerCase().trim() === signerName.toLowerCase().trim();

  const handleBack = () => {
    navigate('/verification-method');
  };

  const handleContinue = () => {
    if (isSignatureComplete) {
      navigate('/success');
    }
  };

  const handlePreviewClick = () => {
    // Could open a larger preview modal or navigate to document view
    console.log('Document preview clicked');
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
              description="This document confirms your business's Beneficial Owners - all individuals who own more than 25% of the business."
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
                  <span className="document-title">Beneficial Owner attestation</span>
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
                      alt="Beneficial Owner attestation document"
                      className="document-image"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
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
                        {isSignatureComplete && (
                          <div className="signature-checkmark">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
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
              className={`btn btn-primary btn-full-width btn-standalone ${!isSignatureComplete ? 'disabled' : ''}`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndSign;