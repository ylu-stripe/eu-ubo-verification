import React from 'react';
import { useUBO } from '../../../contexts/UBOContext';

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ESignModal: React.FC<ESignModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const listType = isDirectors ? 'Directors and Executives' : 'Beneficial Owners';
  const documentTitle = isDirectors ? 'Corporate Structure Disclosure' : 'Beneficial Ownership Disclosure';

  const handleAccept = () => {
    onComplete();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="esign-overlay">
      <div className="esign-modal-new">
        {/* Dialog Header */}
        <div className="esign-dialog-header">
          <div className="esign-header-content">
            <h2 className="esign-dialog-title">{isDirectors ? "Director attestation" : "Beneficial Ownership attestation"}</h2>
            <p className="esign-dialog-description">
              {isDirectors 
                ? "This document confirms your directors. By signing, you will officially attest to the accuracy of your company's director information. "
                : "This document confirms your beneficial owners. By signing, you will officially attest to the accuracy of your company's ownership information. "
              }
              <a href="#" className="esign-support-link">View support article</a>
            </p>
          </div>
          <button className="esign-dialog-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Dialog Content */}
        <div className="esign-dialog-content">
          <div className="esign-document-preview-container">
            <div className="esign-document-preview">
              <div className="esign-document-content">
                <div className="esign-document-text">
                  <h4 className="esign-document-title">
                    {documentTitle}
                  </h4>
                  
                  {/* UBO Table Section */}
                  <div className="esign-table-section">
                    <div className="esign-table-title">
                      {isDirectors ? "Directors (individual persons)" : "Beneficial owners (individual persons)"}
                    </div>
                    
                    <table className="esign-table">
                      <thead>
                        <tr>
                          <th>
                            {isDirectors ? "Full Name of the director" : "Full Name of the beneficial owner"}<br/>
                            <span className="esign-table-subtitle">(incl. Alias, if any)</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentList.filter(item => !item.role || !item.role.includes('Company')).map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legal Entities Table */}
                  <div className="esign-table-section">
                    <div className="esign-table-title">
                      {isDirectors ? "Directors (legal entities or holding companies)" : "Beneficial owners (legal entities or holding companies)"}
                    </div>
                    
                    <table className="esign-table">
                      <thead>
                        <tr>
                          <th>Company's Legal Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="esign-placeholder-cell">
                            <div className="esign-placeholder-line"></div>
                            <div className="esign-placeholder-line short"></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Attestation Text */}
                  <div className="esign-attestation-text">
                    I/We confirm the completeness and accuracy of the information provided in the tables above.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="esign-dialog-footer">
          <div className="esign-footer-actions">
            <button onClick={handleCancel} className="btn btn-secondary esign-download-btn">
              Download
            </button>
            <button
              onClick={handleAccept}
              className="btn btn-primary esign-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignModal; 