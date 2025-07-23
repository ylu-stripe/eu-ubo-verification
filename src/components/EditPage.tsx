import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCompanyData, BeneficialOwner } from '../data/mockData';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

const EditPage: React.FC = () => {
  const navigate = useNavigate();
     const { 
     activeOwners,
     directors,
     setActiveOwners, 
     setDirectors,
     isDirectorsFlow,
     setFlowParams
   } = useUBO();
  
  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const setCurrentList = isDirectors ? setDirectors : setActiveOwners;
  const originalList = isDirectors ? mockCompanyData.directors : mockCompanyData.beneficialOwners;
  
  // Local state for managing items
  const [activeItems, setActiveItems] = useState<BeneficialOwner[]>(currentList);
  const [removedItems, setRemovedItems] = useState<BeneficialOwner[]>([]);
  const [newItems, setNewItems] = useState<BeneficialOwner[]>([]);
  
     // Animation states
   const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [undoingItems, setUndoingItems] = useState<Set<string>>(new Set());
  const [enteringRemovedItems, setEnteringRemovedItems] = useState<Set<string>>(new Set());
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    firstName: '',
    lastName: '',
    role: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = activeItems.find(item => item.id === itemId);
    if (itemToRemove) {
             // Start remove animation
       setRemovingItems(prev => new Set(prev).add(itemId));
       
       // After animation, actually remove the item
       setTimeout(() => {
         const newActiveItems = activeItems.filter(item => item.id !== itemId);
         setActiveItems(newActiveItems);
         setRemovingItems(prev => {
           const newSet = new Set(prev);
           newSet.delete(itemId);
           return newSet;
         });
         
         // If it's an original item, add to removed list with entering animation
         if (originalList.find(item => item.id === itemId)) {
           setRemovedItems([...removedItems, itemToRemove]);
           setEnteringRemovedItems(prev => new Set(prev).add(itemId));
           
           // Remove entering animation after it completes
           setTimeout(() => {
             setEnteringRemovedItems(prev => {
               const newSet = new Set(prev);
               newSet.delete(itemId);
               return newSet;
             });
           }, 400);
         }
         

       }, 400);
    }
  };

  const handleAddBackItem = (item: BeneficialOwner) => {
    // Start undo animation
    setUndoingItems(prev => new Set(prev).add(item.id));
    
    // After animation, actually move the item
    setTimeout(() => {
      setActiveItems([...activeItems, item]);
      setRemovedItems(removedItems.filter(i => i.id !== item.id));
      setUndoingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 400);
  };

  const handleAddNewItem = () => {
    if (newItemForm.firstName && newItemForm.lastName) {
      const newItem: BeneficialOwner = {
        id: `new_${isDirectors ? 'director' : 'owner'}_${Date.now()}`,
        name: `${newItemForm.firstName} ${newItemForm.lastName}`,
        percentage: 0,
        ownershipType: 'direct',
        role: newItemForm.role || (isDirectors ? 'Director' : undefined)
      };
      
      setActiveItems([...activeItems, newItem]);
      setNewItems([...newItems, newItem]);
      setNewItemForm({
        firstName: '',
        lastName: '',
        role: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        postalCode: ''
      });
      setShowAddForm(false);
    }
  };

     const handleContinue = () => {
     // Update the global state
     setCurrentList(activeItems);
     
     // Special case: if this is UBOs and user has no UBOs, go to transition page
     if (!isDirectors && activeItems.length === 0) {
       // Update the global UBO state
       setActiveOwners([]);
       // Navigate to transition page that explains directors collection
       navigate('/no-ubos-transition');
       return;
     }
     
     // Check if there are changes
     const hasRemovedItems = originalList.some(original => 
       !activeItems.find(current => current.id === original.id)
     );
     const hasNewItems = newItems.length > 0;
     
     // If user made changes, go to verification method selection
     if (hasRemovedItems || hasNewItems) {
       navigate('/verification-method');
     } else {
       // Navigate back to confirm page
       navigate(isDirectors ? '/confirm-directors' : '/confirm-owners');
     }
   };

  const handleBack = () => {
    if (isDirectors && activeItems.length === 0) {
      // When directors flow with no prefill, go back to transition page
      navigate('/no-ubos-transition');
    } else {
      navigate(isDirectors ? '/confirm-directors' : '/confirm-owners');
    }
  };

     const handleAddBeneficialOwners = () => {
     // Switch flow to beneficial owners and navigate to that flow
     setFlowParams({
       ubosFound: true,
       directorsFound: false,
       legalEntityMatch: 'trulioo_stripe'
     });
     navigate('/edit-owners');
   };

  if (showAddForm) {
    return (
      <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
        <button className="btn-back mb-24" onClick={() => setShowAddForm(false)}>
          ← Back
        </button>

        <h1 className="page-title">Add a {isDirectors ? 'director' : 'beneficial owner'}</h1>
        <p className="page-description">
          Add information for {isDirectors 
            ? 'a director or officer who significantly influences your organization'
            : 'someone who owns over 25% of your business or who exercises control'
          }.
        </p>

        <div className="mb-32">
          <div className="form-row">
            <div className="form-col">
              <label className="form-label">First name</label>
              <input
                type="text"
                className="form-input"
                value={newItemForm.firstName}
                onChange={(e) => setNewItemForm(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="form-col">
              <label className="form-label">Last name</label>
              <input
                type="text"
                className="form-input"
                value={newItemForm.lastName}
                onChange={(e) => setNewItemForm(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          {isDirectors && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-input"
                value={newItemForm.role}
                onChange={(e) => setNewItemForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. CEO, Director, CFO"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Date of birth</label>
            <input
              type="date"
              className="form-input"
              value={newItemForm.dateOfBirth}
              onChange={(e) => setNewItemForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={newItemForm.address}
              onChange={(e) => setNewItemForm(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={newItemForm.city}
                onChange={(e) => setNewItemForm(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="form-col">
              <label className="form-label">State/Province</label>
              <input
                type="text"
                className="form-input"
                value={newItemForm.state}
                onChange={(e) => setNewItemForm(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Postal/ZIP code</label>
            <input
              type="text"
              className="form-input"
              value={newItemForm.postalCode}
              onChange={(e) => setNewItemForm(prev => ({ ...prev, postalCode: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={handleAddNewItem}
          disabled={!newItemForm.firstName || !newItemForm.lastName}
          className="btn btn-primary btn-full-width"
        >
          Add {isDirectors ? 'director' : 'owner'}
        </button>
      </Modal>
    );
  }

  return (
    <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">
        {isDirectors && activeItems.length === 0 
          ? 'Confirm your directors and officers'
          : `Edit your ${isDirectors ? 'directors and officers' : 'beneficial owners'}`
        }
      </h1>
      <p className="page-description">
        {isDirectors && activeItems.length === 0
          ? 'D&Os are senior directors or officers who significantly influence your organization. Add all directors and officers to continue with verification.'
          : `Update this list to include all ${isDirectors 
              ? 'directors and officers who significantly influence your organization'
              : 'individuals with 25%+ ownership or control of a business, directly or indirectly'
            }.`
        }
      </p>

      {/* Validation message for directors - moved to top */}
      {isDirectors && activeItems.length === 0 && (
        <div className="validation-message">
          <div className="validation-icon">⚠️</div>
          <div className="validation-text">
            <strong>At least one director is required.</strong> You must add a director or officer to continue with verification.
          </div>
        </div>
      )}

      <div className="mb-32">
        <h3 className="section-title">
          {isDirectors ? 'Directors and officers' : 'Beneficial owners'} ({activeItems.length})
        </h3>

        {activeItems.length > 0 ? (
          <>
            {activeItems.map((item) => (
              <div 
                key={item.id} 
                                 className={`owner-item ${removingItems.has(item.id) ? 'removing' : ''}`}
              >
                <div className="owner-info">
                  <div className="owner-name">{item.name}</div>
                  {item.role && (
                    <div className="owner-role">{item.role}</div>
                  )}
                </div>
                <div className="owner-actions">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn btn-small"
                    disabled={removingItems.has(item.id)}
                  >
                    Remove
                  </button>
                  <button className="btn btn-small">
                    Edit
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddForm(true)}
              className="btn-add-owner"
            >
              Add {isDirectors ? 'director' : 'owner'}
            </button>
          </>
        ) : (
          <div className="empty-state-dashed">
            <div className="empty-state-dashed-inner">
              <div className="empty-state-dashed-text">
                There are no {isDirectors ? 'Directors and officers' : 'beneficial owners'}. Add {isDirectors 
                  ? 'directors or officers who significantly influence your organization'
                  : 'individuals with 25%+ ownership or control of your business'
                }.
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-secondary empty-state-button"
            >
              Add {isDirectors ? 'director' : 'owner'}
            </button>
          </div>
        )}
      </div>

      {/* Removed items section */}
      {removedItems.length > 0 && (
        <div className="removed-section mb-32">
          <h3 className="section-title">Removed ({removedItems.length})</h3>
          <p className="removed-description">
            Removing {isDirectors ? 'a director will require documentation for proof of corporate structure' : 'an owner will require a document for proof of ownership'}.
          </p>
          
          {removedItems.map((item) => (
            <div 
              key={item.id} 
              className={`removed-owner-item ${
                undoingItems.has(item.id) ? 'undoing' : 
                enteringRemovedItems.has(item.id) ? 'entering' : ''
              }`}
            >
              <div className="owner-name">{item.name}</div>
              <button
                onClick={() => handleAddBackItem(item)}
                className="btn-undo"
                disabled={undoingItems.has(item.id)}
              >
                Undo
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Directors compliance disclaimer */}
      {isDirectors && (
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
        disabled={isDirectors && activeItems.length === 0}
        className="btn btn-primary btn-full-width btn-standalone"
      >
         {activeItems.length > 0 
           ? (removedItems.length > 0 ? 'Save' : 'Continue') 
           : (isDirectors ? 'Add a director to continue' : 'Continue with no UBOs')
         }
      </button>
    </Modal>
  );
};

export default EditPage; 