import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';
import ESignModal from './ESignModal';

const VerificationMethod: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow, setVerificationMethod } = useUBO();
  const [selectedMethod, setSelectedMethod] = useState<'electronic' | 'upload'>('electronic');
  const [showESignModal, setShowESignModal] = useState(false);

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const listType = isDirectors ? 'directors' : 'beneficial owners';
  const listTypeTitle = isDirectors ? 'directors and officers' : 'beneficial owners';

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
    navigate('/success');
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

        <h1 className="page-title">We need to verify your {listTypeTitle}</h1>
        <p className="page-description">
                  You'll need to upload additional documents to verify your {isDirectors ? 'corporate structure' : 'ownership structures'}, since it doesn't match what we've pulled from public records.{' '}
        <a href="#" className="inline-link">
          View support article
        </a>
        </p>

        <div className="mb-32">
          <div className="verification-owners-section">
            <div className="verification-owners-header">
              <h3 className="section-title">{listTypeTitle.charAt(0).toUpperCase() + listTypeTitle.slice(1)}</h3>
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
          <h3 className="section-title">Select method</h3>
          
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
                    Electronically sign an [attestation]
                  </div>
                  <div className="method-badge">Recommended</div>
                </div>
              </div>
              <div className="method-preview">
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4', marginTop: '8px' }}>
                  Sign a legal document electronically to certify the accuracy of your {isDirectors ? 'directors and officers' : 'beneficial ownership'} information. This is typically the fastest verification method.
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
                    Upload supporting documentation
                  </div>
                </div>
              </div>
              <div className="method-preview">
                <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4', marginTop: '8px' }}>
                  Upload official documents like articles of incorporation, operating agreements, and identity verification for {isDirectors ? 'directors and officers' : 'beneficial owners'}. Our team will review within 1-2 business days.
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