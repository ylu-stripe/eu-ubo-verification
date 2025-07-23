import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

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
      <h1 className="page-title">
        {isDirectorsFlow ? "Verify your corporate structure" : "Verify your business ownership"}
      </h1>
      <p className="page-description">
        {isDirectorsFlow 
          ? "Stripe needs to identify the directors and officers who control your organization to meet regulatory requirements and protect against financial crimes. To do this we'll need your directors and officers (D&Os) "
          : "Stripe needs to identify who controls your business to meet regulatory requirements and protect against financial crimes. To do this we'll need your beneficial owners (UBOs) "
        }
        <a href="#" className="inline-link">View support article</a>
      </p>

      <div style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '4px'
          }}>
            {isDirectorsFlow ? "What are D&Os?" : "What is a UBO?"}
          </div>
          <p style={{ 
            margin: '0', 
            fontSize: '13px',
            color: '#64748b',
            lineHeight: '1.4'
          }}>
            {isDirectorsFlow 
              ? "Directors and Officers are senior individuals who significantly influence your organization and corporate governance."
              : "Ultimate Beneficial Owners are individuals with 25%+ ownership or control of a business, directly or indirectly."
            }
          </p>
        </div>

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
      </div>

      <button onClick={handleContinue} className="btn btn-primary btn-full-width btn-standalone">
        Continue
      </button>
    </Modal>
  );
};

export default VerifyOwnership; 