import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const KYBDocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const { flowParams, setFlowParams } = useUBO();
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock business data for display
  const businessData = {
    businessName: 'Cactus Practice LLC',
    businessAddress: '123 Innovation Drive, San Francisco, CA 94105, United States',
    taxId: 'EIN 12-3456789'
  };

  const handleBack = () => {
    navigate('/kyb-verification');
  };

  const handleEditDetails = () => {
    navigate('/kyb-verification');
  };

  const handleContinue = async () => {
    if (!selectedDocumentType) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark KYB as requiring manual review and navigate to review page
    setFlowParams({
      ...flowParams,
      kybComplete: true,
      kybRequiresManualReview: true
    });
    
    navigate('/kyb-review');
  };

  const handleSkipForNow = () => {
    navigate('/ash');
  };

  const documentTypes = [
    {
      id: 'business_registration',
      name: 'Business registration certificate',
      description: 'Official document showing your business registration and details.'
    },
    {
      id: 'bank_statement',
      name: 'Bank statement',
      description: 'Recent bank statement showing your business name and address.'
    },
    {
      id: 'tax_return',
      name: 'Business tax return',
      description: 'Previous year business tax return with business details.'
    },
    {
      id: 'utility_bill',
      name: 'Utility bill',
      description: 'Recent utility bill showing your business name and address.'
    },
    {
      id: 'lease_agreement',
      name: 'Lease or rental agreement',
      description: 'Business lease agreement or property rental document.'
    }
  ];

  return (
    <Modal title="Verify your business information" onClose={handleBack}>
      <div className="kyb-document-upload">
        <h1 className="kyb-upload-title">Verify your business information</h1>
        <p className="kyb-upload-description">
          Because we were unable to verify your business details automatically, we 
          require additional documents to verify your business.{' '}
          <a href="#" className="support-link">View support article</a>
        </p>

        <div className="kyb-details-section">
          <h3 className="kyb-section-title">Review the details you entered</h3>
          <p className="kyb-section-subtitle">
            Make sure this information matches your business documents.
          </p>

          <div className="kyb-details-block">
            <div className="kyb-details-content">
              <div className="kyb-details-label">Business details</div>
              <div className="kyb-details-info">
                <div className="kyb-detail-line">{businessData.businessName}</div>
                <div className="kyb-detail-line">{businessData.businessAddress}</div>
                <div className="kyb-detail-line">{businessData.taxId}</div>
              </div>
            </div>
            <button 
              onClick={handleEditDetails}
              className="kyb-edit-button"
              type="button"
            >
              <span className="kyb-edit-icon">✏️</span>
            </button>
          </div>
        </div>

        <div className="kyb-upload-section">
          <h3 className="kyb-section-title">Upload document</h3>
          <p className="kyb-upload-subtitle">
            Select one of the following documents to upload. This document 
            must match the information shown on your account.
          </p>

          <div className="kyb-document-options">
            {documentTypes.map((docType) => (
              <label key={docType.id} className="kyb-document-option">
                <input
                  type="radio"
                  name="documentType"
                  value={docType.id}
                  checked={selectedDocumentType === docType.id}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="kyb-radio-input"
                />
                <div className="kyb-document-info">
                  <div className="kyb-document-name">{docType.name}</div>
                  <div className="kyb-document-description">{docType.description}</div>
                </div>
              </label>
            ))}
          </div>

          <button type="button" className="kyb-see-all-options">
            See all options
          </button>
        </div>

        <div className="kyb-upload-actions">
          <button
            onClick={handleContinue}
            disabled={!selectedDocumentType || isSubmitting}
            className="btn btn-primary btn-full-width kyb-continue-btn"
          >
            {isSubmitting ? 'Uploading...' : 'Continue'}
          </button>
          <button
            onClick={handleSkipForNow}
            className="btn btn-secondary btn-full-width kyb-skip-btn"
          >
            Skip for now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default KYBDocumentUpload; 