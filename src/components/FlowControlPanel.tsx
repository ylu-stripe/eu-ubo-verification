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
    directors,
    verificationMethod
  } = useUBO();
  
  // Track pending changes locally
  const [pendingParams, setPendingParams] = useState<FlowParameters>(flowParams);
  const [hasUserToggledParams, setHasUserToggledParams] = useState(false);
  const [hasUserMadeEdits, setHasUserMadeEdits] = useState(false);
  
  // Determine if verification flow is active (configs should be locked)
  const isFlowActive = location.pathname !== '/ash' && location.pathname !== '/';
  
  // Check if there are any pending changes to flow params - only show if user manually toggled
  const hasFlowParamChanges = hasUserToggledParams && JSON.stringify(pendingParams) !== JSON.stringify(flowParams);
  
  // Check if user has made edits to data - only show if user actually made edits
  const hasDataEdits = hasUserMadeEdits && (hasChanges() || hasDirectorChanges());

  // Only sync pending params on initial mount, not on every flowParams change
  useEffect(() => {
    setPendingParams(flowParams);
  }, []); // Empty dependency array - only run on mount

  // Reset edit tracking when flow parameters change (programmatic flow switches)
  useEffect(() => {
    // Reset edit tracking when switching between different flows
    setHasUserMadeEdits(false);
  }, [flowParams.ubosFound, flowParams.directorsFound]);

  // Track when user actually makes edits (more conservative approach)
  useEffect(() => {
    // Only mark as having made edits if they have actual changes AND visited edit pages
    if ((location.pathname === '/edit-owners' || location.pathname === '/edit-directors') && 
        (hasChanges() || hasDirectorChanges())) {
      setHasUserMadeEdits(true);
    }
  }, [location.pathname, hasChanges, hasDirectorChanges]);

  const handleToggle = (key: keyof FlowParameters, value: any) => {
    // Don't allow changes if flow is active
    if (isFlowActive) return;
    
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
      
      {/* Flow Lock Warning */}
      {isFlowActive && (
        <div className="flow-lock-warning">
          <div className="lock-warning-icon">🔒</div>
          <div className="lock-warning-text">
            <strong>Config Locked</strong><br/>
            Settings are locked during verification to prevent mid-flow changes.
          </div>
        </div>
      )}
      
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
      
      <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
        <label className="control-label">UBOs Found:</label>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pendingParams.ubosFound}
              onChange={(e) => handleToggle('ubosFound', e.target.checked)}
              disabled={isFlowActive}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{pendingParams.ubosFound ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
        <label className="control-label">Directors Found:</label>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pendingParams.directorsFound}
              onChange={(e) => handleToggle('directorsFound', e.target.checked)}
              disabled={isFlowActive}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{pendingParams.directorsFound ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
        <label className="control-label">KYB Complete:</label>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pendingParams.kybComplete}
              onChange={(e) => handleToggle('kybComplete', e.target.checked)}
              disabled={isFlowActive}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{pendingParams.kybComplete ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {!pendingParams.kybComplete && (
        <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
          <label className="control-label">KYB Requires Manual Review:</label>
          <div className="toggle-wrapper">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={pendingParams.kybRequiresManualReview}
                onChange={(e) => handleToggle('kybRequiresManualReview', e.target.checked)}
                disabled={isFlowActive}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">{pendingParams.kybRequiresManualReview ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}

      {pendingParams.kybRequiresManualReview && !pendingParams.kybComplete && (
        <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
          <label className="control-label">KYB MVR Complete:</label>
          <div className="toggle-wrapper">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={pendingParams.kybMvrComplete}
                onChange={(e) => handleToggle('kybMvrComplete', e.target.checked)}
                disabled={isFlowActive}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">{pendingParams.kybMvrComplete ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}

      <div className={`control-group ${isFlowActive ? 'disabled' : ''}`}>
        <label className="control-label">Legal Entity:</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_stripe'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_stripe')}
              disabled={isFlowActive}
            />
            <span className="radio-label">Trulioo = Stripe</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_no_response'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_no_response')}
              disabled={isFlowActive}
            />
            <span className="radio-label">No Response</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="legalEntity"
              checked={pendingParams.legalEntityMatch === 'trulioo_not_stripe'}
              onChange={() => handleToggle('legalEntityMatch', 'trulioo_not_stripe')}
              disabled={isFlowActive}
            />
            <span className="radio-label">Trulioo ≠ Stripe</span>
          </label>
        </div>
      </div>

      <div className="control-status">
        <strong>Current Flow:</strong> {
          !pendingParams.kybComplete ? 'KYB Verification' :
          pendingParams.kybRequiresManualReview && !pendingParams.kybMvrComplete ? 'KYB In Review' :
          pendingParams.ubosFound ? 'UBO Found' : 'No UBOs Found → Directors'
        }
      </div>

      {hasFlowParamChanges && !isFlowActive && (
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