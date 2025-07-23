import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const OrgTreeBuilder: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/company-information');
  };

  const handleContinue = () => {
    // Placeholder - would eventually go to the results or edit owners
    navigate('/edit-owners');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Build your ownership tree</h1>
      <p className="page-description">
        We'll help you map out your complex ownership structure to identify your ultimate beneficial owners.
      </p>

      <div className="mb-24">
        <div className="placeholder-content">
          <div className="placeholder-icon">🏗️</div>
          <h3 className="placeholder-title">Org Tree Builder</h3>
          <p className="placeholder-description">
            This is a placeholder for the organizational tree builder flow. This tool will help you:
          </p>
          <ul className="placeholder-list">
            <li>Map complex ownership structures</li>
            <li>Identify intermediate holding companies</li>
            <li>Calculate beneficial ownership percentages</li>
            <li>Determine ultimate beneficial owners</li>
          </ul>
        </div>
      </div>

      <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
        Continue to UBO results
      </button>
    </Modal>
  );
};

export default OrgTreeBuilder; 