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
    setIsLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="esign-overlay">
      <div className="esign-modal">
        <div className="esign-header">
          <h2 className="esign-title">Review document</h2>
          <button className="esign-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="esign-content">
          <p className="esign-description">
            This document confirms your business's beneficial owners. Please review the information below carefully.{' '}
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

          <div className="esign-disclaimer">
            <div className="esign-agreement-text">
              Please review the information above and confirm that all details are accurate. You will complete the electronic signature in the next step.
            </div>
          </div>

          <div className="esign-actions">
            <button onClick={handleCancel} className="btn btn-secondary esign-btn">
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="btn btn-primary esign-btn"
            >
              Continue to signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignModal; 