import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const NoUBOsFound: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, resetDirectorsForFlow } = useUBO();

  const handleContinueWithNoOwners = () => {
    // Switch to directors flow - no directors found, but will collect manually
    setFlowParams({
      ubosFound: false,
      directorsFound: false,
      legalEntityMatch: 'trulioo_stripe',
      kybComplete: false,
      kybRequiresManualReview: false,
      kybMvrComplete: false,
      kybRequirementComplete: false,
      uboRequirementComplete: false
    });
    // Clear directors array for empty state without triggering edit detection
    resetDirectorsForFlow();
    navigate('/no-ubos-transition');
  };

  const handleAddBeneficialOwners = () => {
    // Go to company information page to determine complexity
    navigate('/company-information');
  };

  const handleBack = () => {
    navigate('/confirm-structure');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Confirm your beneficial owners</h1>
      <p className="page-description">
        Beneficial owners are individuals with over 25% ownership or control of a business, directly or indirectly. Verify this list accurately represents your beneficial owners.{' '}
        <a href="#" className="inline-link">
          View support article
        </a>
      </p>

      <div className="mb-24">
        <div className="no-ubos-found-container">
          <div className="no-ubos-message">
            We could not find beneficial owners.
          </div>
        </div>
      </div>

      <div className="flex-column-gap">
        <button onClick={handleContinueWithNoOwners} className="btn btn-primary btn-full-width">
          Continue with no owners
        </button>
        <button onClick={handleAddBeneficialOwners} className="btn btn-secondary btn-full-width">
          Add beneficial owners
        </button>
      </div>
    </Modal>
  );
};

export default NoUBOsFound; 