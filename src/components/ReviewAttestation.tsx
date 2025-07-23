import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

const ReviewAttestation: React.FC = () => {
  const navigate = useNavigate();
  const { isDirectorsFlow } = useUBO();

  const isDirectors = isDirectorsFlow();

  const handleBack = () => {
    navigate('/document-review');
  };

  const handleSubmit = () => {
    // Navigate to success page after submission
    navigate('/success');
  };

  return (
    <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Review and submit</h1>
      <p className="page-description">
        Please review your attestation before submitting.
      </p>

      <div className="document-preview mb-32">
        <h3 className="section-title">Attestation document</h3>
        <div className="preview-content">
          <p>I attest that the information provided about our {isDirectors ? 'directors and officers' : 'beneficial owners'} is true and accurate...</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-primary btn-full-width btn-standalone"
      >
        Submit attestation
      </button>
    </Modal>
  );
};

export default ReviewAttestation; 