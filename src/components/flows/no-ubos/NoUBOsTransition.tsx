import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const NoUBOsTransition: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, flowParams } = useUBO();

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
    navigate('/edit-owners');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">
        {flowParams.directorsFound 
          ? "We'll verify your directors instead" 
          : "We need to verify your directors instead"
        }
      </h1>
      <p className="page-description">
        Since you have no beneficial owners with 25%+ ownership or control, we'll need information about your directors and executives instead.
      </p>

      <div className="mb-32">
        <div className="info-box">
          <h3 className="info-box-title">Who are directors and executives?</h3>
          <p className="info-box-text">
                          Directors and executives are senior individuals who significantly influence your organization's operations and decision-making. This includes:
          </p>
          <ul className="info-box-list">
            <li>Board members and directors</li>
            <li>Executive officers (CEO, CFO, COO, etc.)</li>
            <li>Other senior management with significant authority</li>
          </ul>
        </div>
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
    </Modal>
  );
};

export default NoUBOsTransition; 