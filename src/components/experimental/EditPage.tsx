import React, { useState } from 'react';
import Modal from './Modal';
import { BeneficialOwner, mockCompanyData, mockTwoWayMatchingData } from './mockData';

interface EditPageProps {
  isDirectorsFlow?: boolean;
  initialData?: BeneficialOwner[];
  onSave?: (items: BeneficialOwner[]) => void;
  twoWayMatch?: boolean;
}

const EditPage: React.FC<EditPageProps> = ({ 
  isDirectorsFlow = false,
  initialData,
  onSave,
  twoWayMatch = false
}) => {
  // Use 2-way matching data if enabled, otherwise use regular data
  const defaultData = twoWayMatch ? 
    (isDirectorsFlow ? mockTwoWayMatchingData.directors : mockTwoWayMatchingData.beneficialOwners) :
    (isDirectorsFlow ? mockCompanyData.directors : mockCompanyData.beneficialOwners);
    
  const originalList = defaultData;
  
  // Local state for managing items
  // In 2-way matching, start with only Group A+B (prefill matches) active
  // Put Group C (unexpected) items in removed section from the start
  const initialActiveItems = twoWayMatch 
    ? (initialData || originalList).filter(item => 
        item.ownerGroup === 'existing-match' || 
        item.ownerGroup === 'new-match' || 
        item.isPrefillMatch
      )
    : (initialData || originalList);
    
  const initialRemovedItems = twoWayMatch
    ? (initialData || originalList).filter(item => item.ownerGroup === 'unexpected')
    : [];

  const [activeItems, setActiveItems] = useState<BeneficialOwner[]>(initialActiveItems);
  const [removedItems, setRemovedItems] = useState<BeneficialOwner[]>(initialRemovedItems);
  
  // Track which items were auto-removed (Group C) vs manually removed
  const autoRemovedItems = twoWayMatch ? initialRemovedItems : [];
  const manuallyRemovedItems = twoWayMatch 
    ? removedItems.filter(item => !autoRemovedItems.find(autoItem => autoItem.id === item.id))
    : removedItems; // In 1-way mode, all removed items are manually removed
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    firstName: '',
    lastName: '',
    role: ''
  });

  const getOwnerLabel = (owner: BeneficialOwner) => {
    if (!twoWayMatch) return null;
    
    switch (owner.ownerGroup) {
      case 'existing-match':
        return null; // No label for existing matches
      case 'new-match':
        return 'prefill';
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
      default:
        return '';
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = activeItems.find(item => item.id === itemId);
    if (itemToRemove) {
      const newActiveItems = activeItems.filter(item => item.id !== itemId);
      setActiveItems(newActiveItems);
      
      // Add to removed list (always add, regardless of original status)
      setRemovedItems([...removedItems, itemToRemove]);
    }
  };

  const handleAddBackItem = (item: BeneficialOwner) => {
    setActiveItems([...activeItems, item]);
    setRemovedItems(removedItems.filter(i => i.id !== item.id));
  };

  const handleAddNewItem = () => {
    if (newItemForm.firstName && newItemForm.lastName) {
      const newItem: BeneficialOwner = {
        id: `new_${isDirectorsFlow ? 'director' : 'owner'}_${Date.now()}`,
        name: `${newItemForm.firstName} ${newItemForm.lastName}`,
        percentage: 0, // Percentage doesn't matter for testing
        ownershipType: 'direct',
        role: newItemForm.role || (isDirectorsFlow ? 'Director' : undefined),
        ownerGroup: undefined, // New items have no specific group
        isPrefillMatch: false
      };
      
      setActiveItems([...activeItems, newItem]);
      setNewItemForm({
        firstName: '',
        lastName: '',
        role: ''
      });
      setShowAddForm(false);
    }
  };

  const handleContinue = () => {
    if (onSave) {
      onSave(activeItems);
    }
    console.log('Continue clicked with items:', activeItems);
  };

  const handleBack = () => {
    console.log('Back clicked');
  };

  const handleAddBeneficialOwners = () => {
    console.log('Add beneficial owners clicked');
  };



  if (showAddForm) {
    return (
      <Modal title={isDirectorsFlow ? "Activate payments" : "Verify ownership"}>
        <button className="btn-back mb-24" onClick={() => setShowAddForm(false)}>
          ← Back
        </button>

        <h1 className="page-title">Add a {isDirectorsFlow ? 'director' : 'beneficial owner'}</h1>
        <p className="page-description">
          Add information for {isDirectorsFlow 
            ? 'a director or officer who significantly influences your organization'
            : 'someone who owns over 25% of your business or who exercises control'
          }.
        </p>

        <div className="mb-32">
          <div className="form-row">
            <div className="form-field">
              <label>First name *</label>
              <input
                type="text"
                value={newItemForm.firstName}
                onChange={(e) => setNewItemForm({...newItemForm, firstName: e.target.value})}
                placeholder="First name"
              />
            </div>
            <div className="form-field">
              <label>Last name *</label>
              <input
                type="text"
                value={newItemForm.lastName}
                onChange={(e) => setNewItemForm({...newItemForm, lastName: e.target.value})}
                placeholder="Last name"
              />
            </div>
          </div>

          {isDirectorsFlow && (
            <div className="form-field">
              <label>Role</label>
              <input
                type="text"
                value={newItemForm.role}
                onChange={(e) => setNewItemForm({...newItemForm, role: e.target.value})}
                placeholder="e.g., CEO, Director, etc."
              />
            </div>
          )}


        </div>

        <div className="flex-column-gap">
          <button
            onClick={handleAddNewItem}
            disabled={!newItemForm.firstName || !newItemForm.lastName}
            className="btn btn-primary btn-full-width"
          >
            Add {isDirectorsFlow ? 'director' : 'beneficial owner'}
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="btn btn-secondary btn-full-width"
          >
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={isDirectorsFlow ? "Activate payments" : "Verify ownership"}>
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">
        {isDirectorsFlow && activeItems.length === 0 
          ? 'Confirm your directors and executives'
          : `Edit your ${isDirectorsFlow ? 'directors and executives' : 'beneficial owners'}`
        }
      </h1>
      <p className="page-description">
        {isDirectorsFlow && activeItems.length === 0
          ? 'Directors and executives are senior individuals who significantly influence your organization. Add all directors and executives to continue with verification.'
          : `Update this list to include all ${isDirectorsFlow 
              ? 'directors and executives who significantly influence your organization'
              : 'individuals with 25%+ ownership or control of a business, directly or indirectly'
            }.`
        }
      </p>

      {/* Validation message for directors */}
      {isDirectorsFlow && activeItems.length === 0 && (
        <div className="validation-message">
          <div className="validation-icon">⚠️</div>
          <div className="validation-text">
            <strong>At least one director is required.</strong> You must add a director or officer to continue with verification.
          </div>
        </div>
      )}



      <div className="mb-32">
        <h3 className="section-title">
          {isDirectorsFlow ? 'Directors and executives' : 'Beneficial owners'} ({activeItems.length})
        </h3>

        {activeItems.length > 0 ? (
          <div className="owners-list">
            {activeItems.map((item) => (
              <div key={item.id} className="owner-item">
                <div className="owner-info">
                  <div className="owner-name">
                    {item.name}
                    {getOwnerLabel(item) && (
                      <span className={`owner-label ${getOwnerLabelClass(item)}`}>
                        {getOwnerLabel(item)}
                      </span>
                    )}
                  </div>
                  {item.role && (
                    <div className="owner-role">{item.role}</div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-dashed">
            <div className="empty-state-dashed-inner">
              <div className="empty-state-dashed-text">
                There are no {isDirectorsFlow ? 'directors and executives' : 'beneficial owners'}. Add {isDirectorsFlow 
                  ? 'directors or executives who significantly influence your organization'
                  : 'individuals with 25%+ ownership or control of your business'
                }.
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-secondary empty-state-button"
            >
              Add {isDirectorsFlow ? 'director' : 'beneficial owner'}
            </button>
          </div>
        )}

        {activeItems.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-secondary btn-full-width"
            style={{ 
              marginTop: '16px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add {isDirectorsFlow ? 'director' : 'beneficial owner'}
          </button>
        )}



        {/* 2-way matching specific removed section - Group C (auto-removed) */}
        {twoWayMatch && autoRemovedItems.length > 0 && (
          <div className="removed-section mb-32">
            <h3 className="section-title">Your records don't match government records</h3>
            <p className="removed-description">
              We'll need additional documents to verify them.
            </p>
            
            {autoRemovedItems.map((item) => (
              <div 
                key={`auto-removed-${item.id}`} 
                className="removed-owner-item"
              >
                <div className="owner-name">{item.name}</div>
                <button
                  onClick={() => handleAddBackItem(item)}
                  className="btn btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Add back
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Standard removed items section - manually removed items */}
        {manuallyRemovedItems.length > 0 && (
          <div className="removed-section mb-32">
            <h3 className="section-title">Removed ({manuallyRemovedItems.length})</h3>
            <p className="removed-description">
              Removing {isDirectorsFlow ? 'a director will require documentation for proof of corporate structure' : 'an owner will require a document for proof of ownership'}.
            </p>
            
            {manuallyRemovedItems.map((item) => (
              <div 
                key={`manually-removed-${item.id}`} 
                className="removed-owner-item"
              >
                <div className="owner-name">{item.name}</div>
                <button
                  onClick={() => handleAddBackItem(item)}
                  className="btn btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDirectorsFlow && (
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
      )}

      <button
        onClick={handleContinue}
        disabled={isDirectorsFlow && activeItems.length === 0}
        className="btn btn-primary btn-full-width btn-standalone"
        style={{
          padding: '12px 16px',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        {activeItems.length > 0 
          ? (removedItems.length > 0 ? 'Save' : 'Continue') 
          : (isDirectorsFlow ? 'Add a director to continue' : 'Continue with no UBOs')
        }
      </button>
    </Modal>
  );
};

export default EditPage; 