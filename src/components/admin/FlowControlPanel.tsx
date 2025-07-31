import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUBO, FlowParameters } from '../../contexts/UBOContext';

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
    verificationMethod,
    markKYBRequirementComplete,
    markUBORequirementComplete,
    sandboxMode,
    setSandboxMode
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
      
      {/* Sandbox Mode Toggle - Master Control */}
      {/* 
      <div className="sandbox-mode-section">
        <div className="control-group">
          <label className="control-label">
            <span className="sandbox-mode-label">
              🧪 Sandbox Mode
              {sandboxMode && <span className="sandbox-active-indicator"> (EXPERIMENTAL)</span>}
            </span>
          </label>
          <div className="toggle-wrapper">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">{sandboxMode ? 'Experimental' : 'Production'}</span>
          </div>
        </div>
        {sandboxMode && (
          <div className="sandbox-mode-warning">
            ⚠️ Using experimental components - isolated from main app flow
          </div>
        )}
      </div>
      */}
      
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
      
      {/* Regular Mode Controls */}
      <>
          {/* KYB Section */}
          {/*
          <div className="control-section">
            <div className="control-section-header">
              <h4 className="control-section-title">📋 KYB Settings</h4>
              <span className={`status-badge ${(flowParams.kybComplete || flowParams.kybRequirementComplete) ? 'complete' : 'incomplete'}`}>
                {(flowParams.kybComplete || flowParams.kybRequirementComplete) ? 'Complete' : 'Required'}
              </span>
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
          </div>
          */}

          {/* UBO Section */}
          <div className="control-section">
            <div className="control-section-header">
              <h4 className="control-section-title">👥 UBO Settings</h4>
              <span className={`status-badge ${flowParams.uboRequirementComplete ? 'complete' : 'incomplete'}`}>
                {flowParams.uboRequirementComplete ? 'Complete' : 'Required'}
              </span>
            </div>

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
          </div>

          <div className="control-status">
            <strong>Current Flow:</strong> {
              !pendingParams.kybComplete ? 'KYB Verification' :
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
        </>
    </div>
  );
};

export default FlowControlPanel; 