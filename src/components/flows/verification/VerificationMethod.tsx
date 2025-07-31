import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import ESignModal from './ESignModal';

const VerificationMethod: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow, setVerificationMethod } = useUBO();
  const [selectedMethod, setSelectedMethod] = useState<'electronic' | 'upload'>('electronic');
  const [showESignModal, setShowESignModal] = useState(false);

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const listType = isDirectors ? 'directors' : 'beneficial owners';
  const listTypeTitle = isDirectors ? 'directors and executives' : 'beneficial owners';

  const handleBack = () => {
    if (isDirectors) {
      navigate('/edit-directors');
    } else {
      navigate('/edit-owners');
    }
  };

  const handleEdit = () => {
    if (isDirectors) {
      navigate('/edit-directors');
    } else {
      navigate('/edit-owners');
    }
  };

  const handleContinue = () => {
    if (selectedMethod === 'electronic') {
      setVerificationMethod('electronic');
      setShowESignModal(true);
    } else {
      setVerificationMethod('upload');
      navigate('/document-review-status');
    }
  };

  const handleESignComplete = () => {
    setShowESignModal(false);
    navigate('/review-attestation');
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

        <h1 className="page-title">How would you like to verify?</h1>
        <p className="page-description">
          Choose how you'd like to verify your {listTypeTitle} information.
        </p>

        <div className="mb-32">
          <div className="verification-owners-section">
            <div className="verification-owners-header">
              <h3 className="section-title">{listType.charAt(0).toUpperCase() + listType.slice(1)} ({currentList.length})</h3>
          
            </div>

            <div className="verification-owners-list">
              {currentList.map((item) => (
                <div key={item.id} className="verification-owner-item">
                  {item.name}
                  {item.role && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {item.role}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-32">
          <h3 className="section-title">Verification method</h3>
          
          <div className="method-options">
            <div 
              className={`method-option ${selectedMethod === 'electronic' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('electronic')}
            >
              <div className="method-option-header">
                <div className="method-radio">
                  <div className={`radio-dot ${selectedMethod === 'electronic' ? 'active' : ''}`} />
                </div>
                <div className="method-info">
                  <div className="method-title">
                  Digitally sign an ownership document <span className="method-badge">Recommended</span>
                  </div>
                </div>
              </div>
              <div className="method-preview">
                <div className="preview-lines">
                  <div className="preview-line long" />
                  <div className="preview-line medium" />
                  <div className="preview-line short" />
                </div>
              </div>
            </div>

            <div 
              className={`method-option ${selectedMethod === 'upload' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('upload')}
            >
              <div className="method-option-header">
                <div className="method-radio">
                  <div className={`radio-dot ${selectedMethod === 'upload' ? 'active' : ''}`} />
                </div>
                <div className="method-info">
                  <div className="method-title">
                    Manually upload supporting documents
                  </div>
                </div>
              </div>
              <div className="method-preview">
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4', marginTop: '8px' }}>
                  Upload official documents like articles of incorporation, operating agreements, and identity verification for {isDirectors ? 'directors and executives' : 'beneficial owners'}. Our team will review within 1-2 business days.
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="btn btn-primary btn-full-width btn-standalone"
        >
          Continue
        </button>
      </Modal>
      
      <ESignModal
        isOpen={showESignModal}
        onClose={handleESignClose}
        onComplete={handleESignComplete}
      />
    </>
  );
};

export default VerificationMethod; 