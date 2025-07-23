import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUBO, FlowParameters } from '../contexts/UBOContext';

const FlowControlPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    flowParams, 
    setFlowParams, 
    resetState, 
    hasChanges, 
    hasDirectorChanges,
    activeOwners,
    directors 
  } = useUBO();
  
  // Track pending changes locally
  const [pendingParams, setPendingParams] = useState<FlowParameters>(flowParams);
  const [hasUserToggledParams, setHasUserToggledParams] = useState(false);
  const [hasUserMadeEdits, setHasUserMadeEdits] = useState(false);
  
  // Check if there are any pending changes to flow params - only show if user manually toggled
  const hasFlowParamChanges = hasUserToggledParams && JSON.stringify(pendingParams) !== JSON.stringify(flowParams);
  
  // Check if user has made edits to data - only show if user actually made edits
  const hasDataEdits = hasUserMadeEdits && (hasChanges() || hasDirectorChanges());

  // Only sync pending params on initial mount, not on every flowParams change
  useEffect(() => {
    setPendingParams(flowParams);
  }, []); // Empty dependency array - only run on mount

  // Track when user actually makes edits (more conservative approach)
  useEffect(() => {
    // Only mark as having made edits if they have actual changes AND visited edit pages
    if ((location.pathname === '/edit-owners' || location.pathname === '/edit-directors') && 
        (hasChanges() || hasDirectorChanges())) {
      setHasUserMadeEdits(true);
    }
  }, [location.pathname, hasChanges, hasDirectorChanges]);

  const handleToggle = (key: keyof FlowParameters, value: any) => {
    setPendingParams({
      ...pendingParams,
      [key]: value
    });
    // Mark that user has manually toggled parameters
    setHasUserToggledParams(true);
  };

  const handleApplySettings = () => {
    // Apply the pending changes
    setFlowParams(pendingParams);
    // Reset the flow state
    resetState();
    // Reset interaction tracking
    setHasUserToggledParams(false);
    setHasUserMadeEdits(false);
    // Navigate back to the beginning
    navigate('/ash');
  };

  const handleResetChanges = () => {
    setPendingParams(flowParams);
  };

  const handleRefreshData = () => {
    // Reset all data and navigate to start
    resetState();
    // Reset interaction tracking
    setHasUserToggledParams(false);
    setHasUserMadeEdits(false);
    navigate('/ash');
  };

  return (
    <div className="flow-control-panel">
      <h3 className="control-panel-title">🛠️ Flow Control Panel</h3>
      
      {/* Edit Status Section */}
      {hasDataEdits && (
        <div className="edit-status-section">
          <div className="edit-status-indicator">
            ⚠️ <strong>Edits Made:</strong>
          </div>
          <div className="edit-details">
            {hasChanges() && (
              <div className="edit-item">
                • Beneficial owners modified ({activeOwners.length} active)
              </div>
            )}
            {hasDirectorChanges() && (
              <div className="edit-item">
                • Directors modified ({directors.length} active)
              </div>
            )}
          </div>
          <button 
            className="btn btn-secondary btn-small refresh-btn"
            onClick={handleRefreshData}
          >
            🔄 Start Fresh
          </button>
        </div>
      )}
      
      <div className="control-group">
        <label className="control-label">UBOs Found:</label>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pendingParams.ubosFound}
              onChange={(e) => handleToggle('ubosFound', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{pendingParams.ubosFound ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Directors Found:</label>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pendingParams.directorsFound}
              onChange={(e) => handleToggle('directorsFound', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{pendingParams.directorsFound ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Legal Entity:</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_stripe'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_stripe')}
            />
            <span className="radio-label">Trulioo = Stripe</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_no_response'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_no_response')}
            />
            <span className="radio-label">No Response</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_not_stripe'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_not_stripe')}
            />
            <span className="radio-label">Trulioo ≠ Stripe</span>
          </label>
        </div>
      </div>

      <div className="control-status">
        <strong>Current Flow:</strong> {pendingParams.ubosFound ? 'UBO Found' : 'No UBOs Found → Directors'}
      </div>

      {hasFlowParamChanges && (
        <div className="control-actions">
         
          <button 
            className="btn btn-primary btn-small"
            onClick={handleApplySettings}
          >
            Apply Settings & Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default FlowControlPanel; 