import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const EditBusinessStructure: React.FC = () => {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState('registered');
  const [businessStructure, setBusinessStructure] = useState('multi-member-llc');

  const handleBack = () => {
    navigate('/confirm-structure');
  };

  const handleSave = () => {
    // Save the selections and navigate back
    navigate('/confirm-structure');
  };

  const businessTypes = [
    {
      id: 'unregistered',
      name: 'Unregistered business',
      description: 'A business that is not formally registered with government authorities'
    },
    {
      id: 'registered',
      name: 'Registered business',
      description: 'A business that is formally registered and recognized by government authorities'
    },
    {
      id: 'nonprofit',
      name: 'Nonprofit organization',
      description: 'An organization operated for purposes other than making a profit'
    }
  ];

  const businessStructures = [
    {
      id: 'single-member-llc',
      name: 'Single-member LLC',
      description: 'Limited Liability Company with one owner/member'
    },
    {
      id: 'multi-member-llc',
      name: 'Multi-member LLC',
      description: 'Limited Liability Company with multiple owners/members'
    },
    {
      id: 'partnership',
      name: 'Partnership',
      description: 'Business owned and operated by two or more individuals'
    },
    {
      id: 'private-corporation',
      name: 'Private corporation',
      description: 'Incorporated business with private ownership and limited shareholders'
    }
  ];

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Confirm your business structure</h1>
      <p className="page-description">
        [UBO verification is applicable for Company, Corporation, LLC, and Partnership legal entity structures. Additional info goes here]
      </p>

      <div className="mb-32">
        <div className="form-section">
          <div className="form-section-header">
            <label className="form-section-label">Business type</label>
            <div className="info-icon">ℹ</div>
          </div>
          
          <div className="business-options">
            {businessTypes.map((type) => (
              <div
                key={type.id}
                className={`business-option ${businessType === type.id ? 'business-option-selected' : ''}`}
                onClick={() => setBusinessType(type.id)}
              >
                <div className="business-option-content">
                  <div className="business-option-name">{type.name}</div>
                  <div className="business-option-preview">
                    <div className="preview-line" style={{ width: '80%' }} />
                    <div className="preview-line" style={{ width: '60%' }} />
                    <div className="preview-line" style={{ width: '40%' }} />
                    <div className="preview-line" style={{ width: '70%' }} />
                    <div className="preview-line" style={{ width: '90%' }} />
                    <div className="preview-line" style={{ width: '50%' }} />
                    <div className="preview-line" style={{ width: '85%' }} />
                    <div className="preview-line" style={{ width: '65%' }} />
                    <div className="preview-line" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-32">
        <div className="form-section">
          <div className="form-section-header">
            <label className="form-section-label">Business structure</label>
            <div className="info-icon">ℹ</div>
          </div>
          <p className="form-section-description">
            If your company is publicly traded, refer to this{' '}
            <a href="#" className="support-link">support article</a>{' '}
            for onboarding instructions.
          </p>
          
          <div className="business-options">
            {businessStructures.map((structure) => (
              <div
                key={structure.id}
                className={`business-option ${businessStructure === structure.id ? 'business-option-selected' : ''}`}
                onClick={() => setBusinessStructure(structure.id)}
              >
                <div className="business-option-content">
                  <div className="business-option-name">{structure.name}</div>
                  <div className="business-option-preview">
                    <div className="preview-line" style={{ width: '75%' }} />
                    <div className="preview-line" style={{ width: '85%' }} />
                    <div className="preview-line" style={{ width: '55%' }} />
                    <div className="preview-line" style={{ width: '95%' }} />
                    <div className="preview-line" style={{ width: '65%' }} />
                    <div className="preview-line" style={{ width: '80%' }} />
                    <div className="preview-line" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="btn btn-primary btn-full-width btn-standalone"
      >
        Save
      </button>
    </Modal>
  );
};

export default EditBusinessStructure; 