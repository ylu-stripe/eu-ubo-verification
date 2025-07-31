import React, { useState } from 'react';
import Modal from './Modal';
import { BeneficialOwner, mockCompanyData, mockTwoWayMatchingData } from './mockData';

interface ConfirmPageProps {
  isDirectorsFlow?: boolean;
  initialData?: BeneficialOwner[];
  twoWayMatch?: boolean;
  onEdit?: () => void;
}

const ConfirmPage: React.FC<ConfirmPageProps> = ({ 
  isDirectorsFlow = false, 
  initialData,
  twoWayMatch = false,
  onEdit
}) => {
  // Use 2-way matching data if enabled, otherwise use regular data
  const defaultData = twoWayMatch ? 
    (isDirectorsFlow ? mockTwoWayMatchingData.directors : mockTwoWayMatchingData.beneficialOwners) :
    (isDirectorsFlow ? mockCompanyData.directors : mockCompanyData.beneficialOwners);
    
  const [currentList] = useState<BeneficialOwner[]>(initialData || defaultData);

  // In 2-way matching, show only Groups A+B (expected owners)
  const expectedOwners = twoWayMatch ? 
    currentList.filter(owner => 
      owner.ownerGroup === 'existing-match' || 
      owner.ownerGroup === 'new-match' || 
      owner.isPrefillMatch
    ) : currentList;
    
  // Count removed owners (Group C) for 2-way matching
  const removedOwnersCount = twoWayMatch ? 
    defaultData.filter(owner => owner.ownerGroup === 'unexpected').length : 0;

  const getOwnerLabel = (owner: BeneficialOwner) => {
    if (!twoWayMatch) return null;
    
    switch (owner.ownerGroup) {
      case 'existing-match':
        return null; // No label for existing matches
      case 'new-match':
        return 'prefill';
      case 'unexpected':
        return 'unexpected';
      default:
        return null;
    }
  };

  const getOwnerLabelClass = (owner: BeneficialOwner) => {
    const label = getOwnerLabel(owner);
    if (!label) return '';
    
    switch (label) {
      case 'prefill':
        return 'owner-label-prefill';
      case 'unexpected':
        return 'owner-label-unexpected';
      default:
        return '';
    }
  };

  const handleEdit = () => {
    console.log('Edit clicked for:', isDirectorsFlow ? 'directors' : 'owners');
    onEdit?.();
  };

  const handleAddBeneficialOwners = () => {
    console.log('Add beneficial owners clicked');
  };

  const handleAddDirector = () => {
    console.log('Add director clicked');
  };

  const handleBack = () => {
    console.log('Back clicked');
  };

  const handleContinue = () => {
    console.log('Continue clicked');
  };

  if (isDirectorsFlow) {
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
        {currentList.length === 0 && (
          <div className="validation-message">
            <div className="validation-icon">⚠️</div>
            <div className="validation-text">
              <strong>At least one director is required.</strong> You must add a director or officer to continue with verification.
            </div>
          </div>
        )}

        <div className="mb-32">
          <h3 className="section-title">Directors and executives ({currentList.length})</h3>

          {currentList.length > 0 ? (
            <div className="suggestions-container">
              {currentList.map((director) => (
                <div key={director.id} className="owner-suggestion">
                  {director.name}
                  {director.role && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {director.role}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            disabled={expectedOwners.length === 0}
            className="btn btn-primary btn-full-width"
          >
            {expectedOwners.length > 0 ? 'Continue' : 'Add a director to continue'}
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
        {/* Expected Owners Section */}
        <div className="suggestions-container">
          <h3 className="suggestions-header">
            {twoWayMatch ? 'Expected beneficial owners' : 'Suggestions based on public records'}
          </h3>
          {expectedOwners.map((owner) => (
            <div key={owner.id} className="owner-suggestion">
              <div className="owner-info">
                <div className="owner-name">
                  {owner.name}
                  {getOwnerLabel(owner) && (
                    <span className={`owner-label ${getOwnerLabelClass(owner)}`}>
                      {getOwnerLabel(owner)}
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
          
          {/* Removed owners notice for 2-way matching */}
          {twoWayMatch && removedOwnersCount > 0 && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '8px',
              fontStyle: 'italic'
            }}>
              {removedOwnersCount} owner{removedOwnersCount > 1 ? 's were' : ' was'} removed. Edit owners to re-add them.
            </div>
          )}
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