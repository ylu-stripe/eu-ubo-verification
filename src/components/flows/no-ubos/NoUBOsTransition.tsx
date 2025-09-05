import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import InfoCallout from '../../ui/InfoCallout';

const NoUBOsTransition: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, flowParams, setActiveOwners, setRemovedOwners } = useUBO();

  const handleContinue = () => {
    // Switch to directors flow, but respect original directorsFound setting
    setFlowParams({
      ...flowParams,
      ubosFound: false,
      // Don't override directorsFound - keep original value from previous flow
      // directorsFound: keep existing value
    });
    
    // Navigate based on whether directors were originally found
    if (flowParams.directorsFound) {
      navigate('/confirm-directors');
    } else {
      navigate('/edit-directors');
    }
  };

  const handleBack = () => {
    navigate('/edit-owners');
  };

  const handleAddOwners = () => {
    // Switch flow to beneficial owners and navigate to that flow
    setFlowParams({
      ...flowParams,
      ubosFound: true,
      directorsFound: false
    });
    
    // If we're coming from a "no owners" flow, clear the existing owners
    if (!flowParams.ubosFound) {
      setActiveOwners([]);
      setRemovedOwners([]);
    }
    
    navigate('/edit-owners');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <div className="content-section">
        <div>
          <h1 className="page-title">
            {flowParams.directorsFound 
              ? "We'll verify your directors instead" 
              : "We need to verify your directors instead"
            }
          </h1>
          <p className="page-description">
            Since you have no beneficial owners with 25%+ ownership or control, we'll need information about your directors and executives instead.
          </p>
      </div>
        <div className="mb-32">
          <InfoCallout
            title="Who are directors and executives?"
            description="Directors and executives are senior individuals who significantly influence your organization's operations and decision-making. This includes:"
            items={[
              "Board members and directors",
              "Executive officers (CEO, CFO, COO, etc.)",
              "Other senior management with significant authority"
            ]}
          />
        </div>

        <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button onClick={handleContinue} className="btn btn-primary btn-full-width">
            {flowParams.directorsFound 
              ? "Continue to directors" 
              : "Add directors"
            }
          </button>
          
          <button onClick={handleAddOwners} className="btn btn-secondary btn-full-width">
            Add owners instead
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoUBOsTransition; 