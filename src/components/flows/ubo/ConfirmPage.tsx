import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const ConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    activeOwners, 
    directors, 
    flowParams, 
    isDirectorsFlow, 
    hasChanges, 
    hasDirectorChanges 
  } = useUBO();

  // Determine if this is directors mode based on URL route, not just flow parameters
  const isDirectors = location.pathname === '/confirm-directors' || isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const hasCurrentChanges = isDirectors ? hasDirectorChanges : hasChanges;

  // Only redirect for UBOs flow when not found
  React.useEffect(() => {
    if (!isDirectors && !flowParams.ubosFound) {
      navigate('/confirm-directors');
    }
  }, [isDirectors, flowParams, navigate]);

  const handleEdit = () => {
    navigate(isDirectors ? '/edit-directors' : '/edit-owners');
  };

  const handleAddBeneficialOwners = () => {
    navigate('/edit-owners');
  };

  const handleAddDirector = () => {
    navigate('/edit-directors');
  };

  const handleBack = () => {
    navigate('/confirm-structure');
  };

  const handleContinue = () => {
    if (hasCurrentChanges()) {
      navigate('/verification-method');
    } else {
      // User confirmed prefilled data without changes - go to success
      navigate('/success');
    }
  };

  // Don't render if redirecting (only for UBOs flow)
  if (!isDirectors && !flowParams.ubosFound) {
    return null;
  }

  if (isDirectors) {
    return (
      <Modal title="Activate payments">
        <button className="btn-back mb-24" onClick={handleBack}>
          ← Back
        </button>

        <h1 className="page-title">Are these directors correct?</h1>
        <p className="page-description">
          Directors and executives are senior individuals who significantly influence your organization. Verification required for non-profits or government entities. Verify this list accurately represents your beneficial owners.{' '}
          <a href="#" className="inline-link">
            View support article
          </a>
        </p>

        {/* Validation message for directors - moved to top */}
        {directors.length === 0 && (
          <div className="validation-message">
            <div className="validation-icon">⚠️</div>
            <div className="validation-text">
              <strong>At least one director is required.</strong> You must add a director or officer to continue with verification.
            </div>
          </div>
        )}

        <div className="mb-32">
          <h3 className="section-title">Directors and executives ({directors.length})</h3>

          {directors.length > 0 ? (
            <>
     

              <div className="suggestions-container">
                {directors.map((director) => (
                  <div key={director.id} className="owner-suggestion">
                    {director.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state-dashed">
              <div className="empty-state-dashed-inner">
                <div className="empty-state-dashed-text">
                  There are no directors and executives. You must add at least one director or executive to continue.
                </div>
              </div>
              <button 
                onClick={handleAddDirector}
                className="btn btn-secondary empty-state-button"
              >
                Add director
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="disclaimer-text">
            [To ensure compliance with AML laws, by confirming you are attesting that directors listed are accurate and your business has no{' '}
            <span style={{ textDecoration: 'underline' }}>beneficial owners</span>].
          </p>
          
          <p className="disclaimer-link">
            If this is incorrect,{' '}
            <button 
              onClick={handleAddBeneficialOwners}
              className="link-button"
            >
              add beneficial owners instead
            </button>.
          </p>
        </div>

        <div className="flex-column-gap">
            <button 
              onClick={handleContinue} 
              disabled={directors.length === 0}
              className="btn btn-primary btn-full-width"
            >
                {directors.length > 0 ? 'Continue' : 'Add a director to continue'}
            </button>
            <button onClick={handleEdit} className="btn btn-secondary btn-full-width">
                No, edit directors
            </button>
        </div>
      </Modal>
    );
  }

  // Beneficial owners flow
  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Are these beneficial owners correct?</h1>
      <p className="page-description">
        Beneficial owners are individuals with over 25% ownership or control of a business, directly or indirectly. Verify this list accurately represents your beneficial owners.{' '}
        <a href="#" className="inline-link">
          View support article
        </a>
      </p>

      <div className="mb-32">
        <div className="suggestions-container">
          <h3 className="suggestions-header">Suggestions based on public records</h3>
          {activeOwners.map((owner) => (
            <div key={owner.id} className="owner-suggestion">
              {owner.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-column-gap">
        <button onClick={handleContinue} className="btn btn-primary btn-full-width">
          Confirm
        </button>
        <button onClick={handleEdit} className="btn btn-secondary btn-full-width">
          No, edit owners
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmPage; 