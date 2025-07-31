import React, { useState, useEffect } from 'react';
import { useUBO } from '../../../contexts/UBOContext';

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ESignModal: React.FC<ESignModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [legalName, setLegalName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const listType = isDirectors ? 'Directors and Executives' : 'Beneficial Owners';
  const documentTitle = isDirectors ? 'Corporate Structure Disclosure' : 'Beneficial Ownership Disclosure';

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
    onComplete();
    onClose();
  };

  const handleCancel = () => {
    setLegalName('');
    setIsLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="esign-overlay">
      <div className="esign-modal">
        <div className="esign-header">
          <h2 className="esign-title">Review and electronically sign</h2>
          <button className="esign-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="esign-content">
          <p className="esign-description">
            This document confirms your business's beneficial owners. By electronically signing this form, you will officially attest to the accuracy of your company's ownership information.{' '}
            <a href="#" className="inline-link">
              View support article
            </a>
          </p>

          <div className="esign-document-section">
            <div className="esign-document-header">
              <h3 className="esign-document-title">{documentTitle}</h3>
              <button className="esign-download">
                ↓ Download
              </button>
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
                              <td style={{ border: '1px solid #e5e7eb', padding: '12px', height: '40px' }}>
                                <div style={{ backgroundColor: '#e5e7eb', height: '3px', width: '80%', borderRadius: '2px' }}></div>
                                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>{item.name}</div>
                              </td>
                              
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>
                        Note: Please ensure that all names in the above table are also keyed in on the corresponding account's Stripe dashboard.
                      </div>
                    </div>

                    {/* Legal Entities Section */}
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

                    {/* Signature Section */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px', fontWeight: '600' }}>Signed:</div>
                      <div style={{ 
                        border: '2px solid #6366f1', 
                        borderRadius: '6px',
                        padding: '12px',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: legalName ? '#f0f9ff' : 'white',
                        marginBottom: '8px'
                      }}>
                        {legalName && (
                          <div style={{
                            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe Script", "Brush Script MT", cursive',
                            fontSize: '18px',
                            fontWeight: '300',
                            color: '#6366f1',
                            transform: 'rotate(-1deg)',
                            fontStyle: 'italic'
                          }}>
                            ✗ {legalName}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        July 18, 2025
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="esign-form-section">
            <label className="esign-form-label">Legal name</label>
            <input
              type="text"
              className="esign-form-input"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Your name here"
              disabled={isLoading}
            />
          </div>

          <div className="esign-disclaimer">
            <div className="esign-agreement-text">
              By signing, you agree to the terms and conditions set forth above and confirm that all information provided is true and accurate. This electronic signature has the same legal effect as a handwritten signature and you understand that you are bound by the terms of this agreement.
            </div>
          </div>

          <div className="esign-actions">
            <button onClick={handleCancel} className="btn btn-secondary esign-btn">
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!legalName.trim() || isLoading}
              className="btn btn-primary esign-btn"
            >
              Accept and e-sign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignModal; 