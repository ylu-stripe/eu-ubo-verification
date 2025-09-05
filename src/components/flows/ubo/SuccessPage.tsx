import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasChanges, hasDirectorChanges, verificationMethod, isDirectorsFlow } = useUBO();
  
  const isDirectors = isDirectorsFlow();
  const userMadeChanges = isDirectors ? hasDirectorChanges() : hasChanges();
  const usedEsign = verificationMethod === 'electronic';
  const usedUpload = verificationMethod === 'upload';

  // Determine which success page to show
  const isInReview = userMadeChanges && usedUpload;
  const isComplete = !userMadeChanges || (userMadeChanges && usedEsign);

  const handleContinue = () => {
    navigate('/ash?completed=true');
  };

  if (isInReview) {
    // Show "In Review" version for document upload
    const steps = [
      { id: 'get-started', label: 'Get started', active: true },
      { id: 'confirm-owners', label: 'Confirm owners', active: true },
      { id: 'upload-docs', label: 'Upload documents', active: true },
      { id: 'submit-information', label: 'Submit information', active: true }
    ];

    return (
      <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
        <div className="content-section">
          <h1 className="success-title-left">Thanks for submitting your information</h1>

          {/* Vertical Stepper */}
          <div className="vertical-stepper">
            <div className="stepper-line" />
            
            {steps.map((step, index) => (
              <div key={step.id} className="stepper-item">
                <div className={`stepper-circle ${step.active ? 'active' : ''}`}>
                  {step.active && <div className="stepper-dot active" />}
                </div>
                
                <div className="stepper-content">
                  <div className={`stepper-label ${step.active ? 'active' : ''}`}>
                    {step.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="success-info-section">
            <h2 className="success-info-title">Your information is in review</h2>
            <p className="success-info-description">
              This typically takes 2-3 business days. Time spent in review won't count toward your deadline.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="btn btn-primary btn-full-width btn-standalone"
          >
            Continue
          </button>
        </div>
      </Modal>
    );
  }

  // Show "Complete" version for confirmed prefill or e-signed changes
  const completeSteps = [
    { id: 'get-started', label: 'Get started', active: true },
    { id: 'confirm-owners', label: 'Confirm owners', active: true },
    ...(userMadeChanges ? [{ id: 'esign-attestation', label: 'E-sign attestation', active: true }] : []),
    { id: 'verification-complete', label: 'Verification complete', active: true }
  ];

  return (
    <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
      <div className="content-section">
        <h1 className="success-title-left">
          {userMadeChanges ? 'Thank you for verifying your information' : 'Thank you for verifying your information'}
        </h1>

        {/* Vertical Stepper */}
        <div className="vertical-stepper">
          <div className="stepper-line" />
          
          {completeSteps.map((step, index) => (
            <div key={step.id} className="stepper-item">
              <div className={`stepper-circle ${step.active ? 'active' : ''}`}>
                {step.active && <div className="stepper-dot active" />}
              </div>
              
              <div className="stepper-content">
                <div className={`stepper-label ${step.active ? 'active' : ''}`}>
                  {step.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="success-info-section">
          <h2 className="success-info-title">You're all done</h2>
          <p className="success-info-description">
            {userMadeChanges 
              ? `There is no further action required from you.`
              : `There is no further action required from you.`
            }
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="btn btn-primary btn-full-width btn-standalone"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default SuccessPage; 