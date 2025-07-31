import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const KYBVerification: React.FC = () => {
  const navigate = useNavigate();
  const { flowParams, setFlowParams } = useUBO();
  const [showTestModal, setShowTestModal] = useState(false);

  // Mock business data for confirmation
  const businessData = {
    businessName: 'Cactus Practice LLC',
    businessAddress: '123 Innovation Drive, San Francisco, CA 94105, United States',
    taxId: 'EIN 12-3456789'
  };

  const handleBack = () => {
    navigate('/ash');
  };

  const handleEdit = () => {
    navigate('/edit-business-details');
  };

  const handleContinue = () => {
    // Go to document upload for manual review
    setFlowParams({
      ...flowParams,
      kybRequiresManualReview: true
    });
    navigate('/kyb-document-upload');
  };

  const handleAutoVerifyTest = (passes: boolean) => {
    setShowTestModal(false);
    
    if (passes) {
      // Automatic verification success
      setFlowParams({
        ...flowParams,
        kybComplete: true,
        kybRequiresManualReview: false
      });
      navigate('/kyb-success');
    } else {
      // Automatic verification fails - go to manual review
      setFlowParams({
        ...flowParams,
        kybRequiresManualReview: true
      });
      navigate('/kyb-document-upload');
    }
  };

  const handleEditWithAutoVerify = () => {
    // Show test modal for automatic verification simulation
    setShowTestModal(true);
  };

  // Show data mismatch warning (for testing)
  const showDataMismatchWarning = flowParams.legalEntityMatch === 'trulioo_not_stripe';

  return (
    <>
      <Modal title="Verify business information">
        <button className="btn-back mb-24" onClick={handleBack}>
          ← Back
        </button>

        <h1 className="page-title">Confirm your business details</h1>
        <p className="page-description">
          We need to verify your business information to comply with regulatory requirements. Please review the details below.
        </p>

        <div className="mb-32">
          <h3 className="section-title">Review your business information</h3>
          <p className="page-description">
            Make sure this information matches your legal business documents.
          </p>

          {/* Data Mismatch Warning Banner */}
          {showDataMismatchWarning && (
            <div className="data-mismatch-banner">
              ⚠ We found some discrepancies in this information. Please review and update if necessary.
            </div>
          )}
          
          <div className="reference-block">
            <div className="reference-block-content">
              <div className="reference-block-title">
                Business details
              </div>
              <div className="reference-block-description">
                <div className="business-detail-line">{businessData.businessName}</div>
                <div className="business-detail-line">{businessData.businessAddress}</div>
                <div className="business-detail-line">{businessData.taxId}</div>
              </div>
            </div>
            <button
              onClick={handleEditWithAutoVerify}
              className="btn btn-small reference-block-action"
            >
              Edit
            </button>
          </div>
        </div>

        <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
          Continue with document upload
        </button>
      </Modal>

      {/* Test Modal for Automatic Verification */}
      {showTestModal && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '300px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              Testing: Automatic Verification
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6b7280' }}>
              Simulate the result of automatic verification after editing business details:
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleAutoVerifyTest(true)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                ✅ Verification Passes
              </button>
              <button
                onClick={() => handleAutoVerifyTest(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                ❌ Verification Fails
              </button>
            </div>
            <button
              onClick={() => setShowTestModal(false)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#9ca3af'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KYBVerification; 