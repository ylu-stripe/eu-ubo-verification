import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

const NoUBOsTransition: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams } = useUBO();

  const handleContinue = () => {
    // Switch to directors flow
    setFlowParams({
      ubosFound: false,
      directorsFound: true,
      legalEntityMatch: 'trulioo_stripe'
    });
    navigate('/edit-directors');
  };

  const handleBack = () => {
    navigate('/edit-owners');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">We'll verify your directors instead</h1>
      <p className="page-description">
        Since you have no beneficial owners with 25%+ ownership or control, we'll need information about your directors and officers instead.
      </p>

      <div className="mb-32">
        <div className="info-box">
          <h3 className="info-box-title">What are Directors & Officers (D&Os)?</h3>
          <p className="info-box-text">
            Directors and Officers are senior individuals who significantly influence your organization's operations and decision-making. This includes:
          </p>
          <ul className="info-box-list">
            <li>Board members and directors</li>
            <li>Executive officers (CEO, CFO, COO, etc.)</li>
            <li>Other senior management with significant authority</li>
          </ul>
          <p className="info-box-text">
            This information helps us verify your business structure and comply with regulatory requirements.
          </p>
        </div>
      </div>

      <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
        Continue to directors
      </button>
    </Modal>
  );
};

export default NoUBOsTransition; 