import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const KYBSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { shouldShowUBO, markKYBRequirementComplete } = useUBO();

  const handleContinue = () => {
    markKYBRequirementComplete();
    navigate('/ash?completed=true');
  };

  const handleContinueToUBO = () => {
    markKYBRequirementComplete();
    navigate('/verify-ownership?entry=kyb');
  };

  return (
    <Modal title="Verify business information">
      <div className="success-page-left">
        <h1 className="success-title-left">Business verification complete!</h1>

        {/* Progress Stepper */}
        <div className="success-stepper">
          <div className="success-step">
            <div className="success-step-circle completed">✓</div>
            <div className="success-step-label">Submit information</div>
          </div>
          <div className="success-step">
            <div className="success-step-circle completed">✓</div>
            <div className="success-step-label">Automatic verification</div>
          </div>
          <div className="success-step">
            <div className="success-step-circle completed">✓</div>
            <div className="success-step-label">Verification complete</div>
          </div>
        </div>

        <div className="success-info-section">
          <h2 className="success-info-title">Business verified successfully</h2>
          <p className="success-info-description">
            Your business information has been automatically verified and approved. Your account is now ready for the next verification step.
          </p>
        </div>

        {shouldShowUBO() && (
          <div className="next-task-section">
            <div className="next-task-banner">
              <div className="next-task-icon">📋</div>
              <div className="next-task-content">
                <div className="next-task-title">You have additional tasks to review</div>
                <div className="next-task-description">
                  Complete beneficial ownership verification to finish your account setup.
                </div>
              </div>
            </div>
            
            <button
              onClick={handleContinueToUBO}
              className="btn btn-primary btn-full-width"
              style={{ marginBottom: '12px' }}
            >
              Continue to next task
            </button>
          </div>
        )}

        <button
          onClick={handleContinue}
          className={`btn btn-secondary btn-full-width ${shouldShowUBO() ? '' : 'btn-standalone'}`}
        >
          Return to Dashboard
        </button>
      </div>
    </Modal>
  );
};

export default KYBSuccess; 