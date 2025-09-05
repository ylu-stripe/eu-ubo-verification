import React, { useState, useEffect } from 'react';
import { useUBO } from '../../../contexts/UBOContext';

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ESignModal: React.FC<ESignModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [isLoading, setIsLoading] = useState(true);
  const [signatureName, setSignatureName] = useState('');

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const documentTitle = isDirectors ? 'Corporate Structure Disclosure' : 'Beneficial Ownership Disclosure';
  
  // For demo purposes, using the first owner's name as the signer
  const signerName = 'Steve Stevenson';
  const isSignatureComplete = signatureName.toLowerCase().trim() === signerName.toLowerCase().trim();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate document preparation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAccept = () => {
    if (isSignatureComplete) {
      onComplete();
      onClose();
    }
  };

  const handleCancel = () => {
    setIsLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="esign-overlay">
      <div className="esign-modal-new">
        {/* Header */}
        <div className="esign-header-new">
          <div className="esign-header-content">
            <div className="esign-header-text">
              <h2 className="esign-title-new">Review and electronically sign</h2>
              <p className="esign-description-new">
                This document confirms your business's Beneficial Owners - all individuals who own more than 25% of the business.
              </p>
            </div>
            <button className="esign-close-new" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="esign-content-new">
          <div className="esign-document-container">
            <div className="esign-document-header">
              <div className="esign-document-icon">📄</div>
              <div className="esign-document-name">Beneficial Owner attestation</div>
            </div>
            
            <div className="esign-document-preview">
              {isLoading ? (
                <div className="esign-loading">
                  <div className="esign-spinner" />
                  <div className="esign-loading-text">Prepping the document...</div>
                </div>
              ) : (
                <div className="esign-document-content">
                  <div className="esign-document-text">
                    <h4 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>
                      {documentTitle}
                    </h4>
                    
                    {/* UBO Table Section */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                        Beneficial owners (individual persons)
                      </div>
                      
                      <table style={{ width: '100%', border: '1px solid #e5e7eb', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left', fontWeight: '600' }}>
                              Full Name of the beneficial owner<br/>
                              <span style={{ fontSize: '10px', fontWeight: '400' }}>(incl. Alias, if any)</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentList.filter(item => !item.role || !item.role.includes('Company')).map((item) => (
                            <tr key={item.id}>
                              <td style={{ border: '1px solid #e5e7eb', padding: '12px' }}>
                                {item.name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Legal Entities Table */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                        Beneficial owners (legal entities or holding companies)
                      </div>
                      
                      <table style={{ width: '100%', border: '1px solid #e5e7eb', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left', fontWeight: '600' }}>
                              Company's Legal Name
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: '1px solid #e5e7eb', padding: '12px', height: '40px' }}>
                              <div style={{ backgroundColor: '#e5e7eb', height: '3px', width: '70%', borderRadius: '2px' }}></div>
                              <div style={{ backgroundColor: '#e5e7eb', height: '3px', width: '40%', borderRadius: '2px', marginTop: '4px' }}></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Attestation Text */}
                    <div style={{ fontSize: '12px', marginBottom: '24px', lineHeight: '1.4' }}>
                      I/We confirm the completeness and accuracy of the information provided in the tables above.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signature Section */}
          <div className="esign-signature-section">
            <div className="esign-signature-label">
              To be signed by <span className="esign-signer-name">{signerName}</span>
            </div>
            <div className="esign-signature-field">
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder={`Enter "${signerName}" to sign`}
                className="esign-signature-input"
              />
              {isSignatureComplete && (
                <div className="esign-signature-checkmark">✓</div>
              )}
            </div>
          </div>

          <div className="esign-disclaimer-new">
            <p>
              By electronically signing your name, you will officially attest to the accuracy of your company's ownership information.{' '}
              <a href="#" className="esign-support-link">View support article</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="esign-footer-new">
          <button onClick={handleCancel} className="btn btn-secondary esign-btn-new">
            Back
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading || !isSignatureComplete}
            className="btn btn-primary esign-btn-new"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ESignModal; 