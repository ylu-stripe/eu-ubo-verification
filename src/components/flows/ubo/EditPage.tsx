import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockCompanyData, BeneficialOwner } from '../../../data/mockData';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const EditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    activeOwners,
    directors,
    removedOwners,
    setActiveOwners, 
    setDirectors,
    setRemovedOwners,
    isDirectorsFlow,
    setFlowParams,
    flowParams
  } = useUBO();
  
  // Determine if this is directors mode based on URL route, not just flow parameters
  const isDirectors = location.pathname === '/edit-directors' || isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;
  const setCurrentList = isDirectors ? setDirectors : setActiveOwners;
  const originalList = isDirectors ? mockCompanyData.directors : mockCompanyData.beneficialOwners;
  
  // Local state for managing items
  // For directors mode: if directorsFound is false, start with empty list
  const initialActiveItems = isDirectors && !flowParams.directorsFound ? [] : currentList;
  const [activeItems, setActiveItems] = useState<BeneficialOwner[]>(initialActiveItems);
  const [removedItems, setRemovedItems] = useState<BeneficialOwner[]>(isDirectors ? [] : removedOwners);
  const [newItems, setNewItems] = useState<BeneficialOwner[]>([]);

  // Sync state when switching between flows
  useEffect(() => {
    if (!isDirectors) {
      // When switching to UBO mode, load the global removed owners
      setRemovedItems(removedOwners);
      setActiveItems(activeOwners);
    } else {
      // When in directors mode, clear removed items (directors don't use global removed state)
      setRemovedItems([]);
      const initialDirectorItems = !flowParams.directorsFound ? [] : directors;
      setActiveItems(initialDirectorItems);
    }
  }, [isDirectors, flowParams.directorsFound]);
  
     // Animation states
   const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [undoingItems, setUndoingItems] = useState<Set<string>>(new Set());
  const [enteringRemovedItems, setEnteringRemovedItems] = useState<Set<string>>(new Set());
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    firstName: '',
    lastName: '',
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
        // Use functional updates to avoid stale closure issues
        setActiveItems(currentActiveItems => {
          const newActiveItems = currentActiveItems.filter(item => item.id !== itemId);
          // Update global state immediately for UBO flow
          if (!isDirectors) {
            setActiveOwners(newActiveItems);
          }
          return newActiveItems;
        });
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        
        // If it's an original item, add to removed list with entering animation
        if (originalList.find(item => item.id === itemId)) {
          setRemovedItems(currentRemovedItems => {
            const updatedRemovedItems = [...currentRemovedItems, itemToRemove];
            // Only sync with global state for UBO flow
            if (!isDirectors) {
              setRemovedOwners(updatedRemovedItems);
            }
            return updatedRemovedItems;
          });
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
      // Use functional updates to avoid stale closure issues
      setActiveItems(currentActiveItems => {
        const newActiveItems = [...currentActiveItems, item];
        // Update global state immediately for UBO flow
        if (!isDirectors) {
          setActiveOwners(newActiveItems);
        }
        return newActiveItems;
      });
      setRemovedItems(currentRemovedItems => {
        const updatedRemovedItems = currentRemovedItems.filter(i => i.id !== item.id);
        // Only sync with global state for UBO flow
        if (!isDirectors) {
          setRemovedOwners(updatedRemovedItems);
        }
        return updatedRemovedItems;
      });
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
        role: isDirectors ? undefined : undefined
      };
      
      setActiveItems([...activeItems, newItem]);
      setNewItems([...newItems, newItem]);
      setNewItemForm({
        firstName: '',
        lastName: '',
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
    // Only sync removed owners for UBO flow, not directors
    if (!isDirectors) {
      setRemovedOwners(removedItems);
    }
    
    // Special case: if this is UBOs and user has no UBOs, go to transition page
    if (!isDirectors && activeItems.length === 0) {
      // Update the global UBO state
      setActiveOwners([]);
      setRemovedOwners(removedItems);
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
      ...flowParams,
      ubosFound: true,
      directorsFound: false
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
          ? 'Confirm your directors and executives'
          : `Edit your ${isDirectors ? 'directors and executives' : 'beneficial owners'}`
        }
      </h1>
      <p className="page-description">
        {isDirectors && activeItems.length === 0
          ? 'Directors and executives are senior individuals who significantly influence your organization. Add all directors and executives to continue with verification.'
          : `Update this list to include all ${isDirectors 
              ? 'directors and executives who significantly influence your organization'
              : 'individuals with 25%+ ownership or control of a business, directly or indirectly'
            }.`
        }
      </p>



      <div className="mb-32">
        <h3 className="section-title">
          {isDirectors ? 'Directors and executives' : 'Beneficial owners'} ({activeItems.length})
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
                  {!isDirectors && item.role && (
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
                There are no {isDirectors ? 'directors and executives' : 'beneficial owners'}. {isDirectors 
                  ? 'Add directors or executives who significantly influence your organization'
                  : 'Confirm this is correct or add individuals with more than 25% ownership of your business'
                }.
              </div>
            </div>
            
            {isDirectors && (
              <div style={{ 
                color: '#dc2626', 
                marginTop: '16px', 
                marginBottom: '16px',
                fontSize: '12px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}>
                <span style={{ fontSize: '14px', marginTop: '-1px' }}>⚠️</span>
                <span><strong>You must add at least one director.</strong> If you don't have any directors, you may need to <span style={{ textDecoration: 'underline' }}>update your business structure.</span></span>
              </div>
            )}
            
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
            To ensure compliance with AML laws, by confirming you are attesting that directors listed are accurate and your business has no{' '}
            <span style={{ textDecoration: 'underline' }}>beneficial owners</span>.
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
            ? 'Continue'
            : (isDirectors ? 'Add a director to continue' : 'Continue with no UBOs')
          }
      </button>
    </Modal>
  );
};

export default EditPage; 