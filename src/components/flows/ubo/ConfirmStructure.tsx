import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import { mockCompanyData } from '../../../data/mockData';
import Modal from '../../ui/Modal';

const ConfirmStructure: React.FC = () => {
  const navigate = useNavigate();
  const { flowParams, shouldShowDirectors } = useUBO();

  const handleContinue = () => {
    // Always start with UBO flow first
    if (flowParams.ubosFound) {
      navigate('/confirm-owners');
    } else if (flowParams.directorsFound) {
      // No UBOs but yes directors - go to confirm directors page
      navigate('/confirm-directors');
    } else {
      // No UBOs AND no directors - show the "no UBOs found" page
      navigate('/no-ubos-found');
    }
  };

  const handleEdit = () => {
    navigate('/edit-business-structure');
  };

  const handleBack = () => {
    navigate('/verify-ownership');
  };

  const showDataMismatchWarning = flowParams.legalEntityMatch === 'trulioo_not_stripe';

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Confirm your business structure</h1>
      <p className="page-description">
      Take a moment to confirm your business type, as this affects your verification process
      </p>

      <div className="mb-24">
        <h3 className="section-title">Review your business structure</h3>
        <p className="page-description">
          Make sure this information is correct.
        </p>

        {/* Data Mismatch Warning Banner */}
        {showDataMismatchWarning && (
          <div className="data-mismatch-banner mt-1">
            ⚠ According to [source], your business type is [type]. Please verify your selection.
          </div>
        )}
        
        <div className="reference-block">
          <div className="reference-block-content">
            <div className="reference-block-title">
              Private corporation
            </div>
            <div className="reference-block-description">
              Your company has shares that are limited to internal groups like employees, founders, family members or a limited group of investors.
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="btn btn-small reference-block-action"
          >
            Edit
          </button>
        </div>
      </div>

      <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
        Continue
      </button>
    </Modal>
  );
};

export default ConfirmStructure; 