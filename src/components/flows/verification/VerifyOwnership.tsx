import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import PageHeader from '../../ui/PageHeader';
import InfoCallout from '../../ui/InfoCallout';

const VerifyOwnership: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { shouldShowDirectors } = useUBO();
  const entryPoint = searchParams.get('entry') || 'email';

  const isDirectorsFlow = shouldShowDirectors();

  const handleContinue = () => {
    navigate('/confirm-structure');
  };

  const handleClose = () => {
    navigate('/ash');
  };

  const steps = isDirectorsFlow ? [
    { id: 'get-started', label: 'Get started', active: true },
    { id: 'confirm-directors', label: 'Confirm or edit directors', active: false },
    { id: 'upload-docs', label: 'Upload documents', active: false },
    { id: 'verify-business', label: 'Verify business', active: false }
  ] : [
    { id: 'get-started', label: 'Get started', active: true },
    { id: 'confirm-owners', label: 'Confirm or edit owners', active: false },
    { id: 'upload-docs', label: 'Upload documents', active: false },
    { id: 'verify-business', label: 'Verify business', active: false }
  ];

  return (
    <Modal title={isDirectorsFlow ? "Activate payments" : "Verify ownership"} onClose={handleClose}>
      <div className="content-section">
        <PageHeader
          title={isDirectorsFlow ? "Verify your corporate structure" : "Verify your business ownership"}
          description={
            <>
              {isDirectorsFlow 
                ? "Stripe needs to identify the directors and executives who control your organization to meet regulatory requirements and protect against financial crimes. To do this we'll need your directors and executives "
                : "Stripe needs to identify the beneficial owners of your business to meet regulatory requirements and protect against financial crimes. "
              }
              <a href="#" className="inline-link">View support article</a>
            </>
          }
        />

          <InfoCallout
            title={isDirectorsFlow ? "What are directors and executives?" : "What is a beneficial owner?"}
            description={isDirectorsFlow 
              ? "Directors and executives are senior individuals who significantly influence your organization and corporate governance."
              : "Beneficial owners are individuals with 25%+ ownership or control of a business, directly or indirectly."
            }
          />

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

        <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default VerifyOwnership; 