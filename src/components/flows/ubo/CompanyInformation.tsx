import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const CompanyInformation: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, setActiveOwners } = useUBO();
  const [selectedComplexity, setSelectedComplexity] = useState<'simple' | 'complex' | null>(null);

  const handleContinue = () => {
    if (selectedComplexity === 'simple') {
      // Set UBO flow and go to edit owners empty state
      setFlowParams({
        ubosFound: true,
        directorsFound: false,
        legalEntityMatch: 'trulioo_stripe',
        kybComplete: false,
        kybRequiresManualReview: false,
        kybMvrComplete: false,
        kybRequirementComplete: false,
        uboRequirementComplete: false
      });
      // Clear existing owners so user starts with empty list
      setActiveOwners([]);
      navigate('/edit-owners');
    } else if (selectedComplexity === 'complex') {
      // Go to org tree builder (placeholder)
      navigate('/org-tree-builder');
    }
  };

  const handleBack = () => {
    navigate('/no-ubos-found');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Tell us about your company structure</h1>
      <p className="page-description">
        Help us understand your shareholding structure so we can guide you through the right verification process.
      </p>

      <div className="mb-24">
        <h3 className="section-title">What best describes your company's ownership structure?</h3>
        
        <div className="structure-options">
          <label className={`structure-option ${selectedComplexity === 'simple' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="complexity"
              value="simple"
              checked={selectedComplexity === 'simple'}
              onChange={() => setSelectedComplexity('simple')}
            />
            <div className="structure-option-content">
              <div className="structure-option-title">Simple ownership structure</div>
              <div className="structure-option-description">
                Direct ownership by individuals or a small number of entities. Easy to trace ownership back to natural persons.
              </div>
            </div>
          </label>

          <label className={`structure-option ${selectedComplexity === 'complex' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="complexity"
              value="complex"
              checked={selectedComplexity === 'complex'}
              onChange={() => setSelectedComplexity('complex')}
            />
            <div className="structure-option-content">
              <div className="structure-option-title">Complex ownership structure</div>
              <div className="structure-option-description">
                Multiple layers of ownership through holding companies, trusts, or other entities. Requires detailed mapping to identify ultimate beneficial owners.
              </div>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedComplexity}
        className="btn btn-primary btn-full-width btn-standalone"
      >
        Continue
      </button>
    </Modal>
  );
};

export default CompanyInformation; 