import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';

const ASHEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    resetState, 
    verificationMethod, 
    flowParams,
    shouldShowUBO,
    markUBORequirementComplete
  } = useUBO();

  // Auto-reset flow when returning to ASH after completing verification
  useEffect(() => {
    const completedParam = searchParams.get('completed');
    const manualReviewParam = searchParams.get('manualReview');
    
    if (completedParam === 'true' && verificationMethod !== null) {
      // Reset the flow state so they start fresh next time
      resetState();
      // Clean up the URL parameter
      setSearchParams({});
    }

    if (manualReviewParam === 'ubo' && !flowParams.uboRequirementComplete) {
      markUBORequirementComplete();
      // Clean up the URL parameter
      setSearchParams({});
    }
  }, [searchParams, verificationMethod, flowParams.uboRequirementComplete, resetState, setSearchParams, markUBORequirementComplete]);

  const handleTaskClick = (taskId: string) => {
    if (taskId === 'task_ubo') {
      navigate('/verify-ownership?entry=ash');
    }
    // Other tasks would be handled here
  };

  // Build dynamic task list based on user's progress
  const getDynamicTasks = () => {
    const tasks = [];
    

    
    if (shouldShowUBO()) {
      tasks.push({
        id: 'task_ubo',
        title: 'Verify beneficial ownership information',
        date: 'Due for EU compliance',
        impact: 'Impacts account access and payments',
        icon: '📅',
        clickable: true,
        status: undefined
      });
    }
    
    return tasks;
  };

  const dynamicTasks = getDynamicTasks();

  return (
    <div className="ash-dashboard">
      {/* Sidebar */}
      <div className="ash-sidebar">
        <div className="ash-sidebar-header">
          <div className="ash-brand">
            <div className="ash-brand-icon">🌵</div>
            <div className="ash-brand-name">Cactus Practice</div>
          </div>
        </div>
        
        <div className="ash-search">
          <div className="ash-search-input">
            <span className="ash-search-icon">🔍</span>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="ash-nav">
          <div className="ash-nav-item">
            <span className="ash-nav-icon">🏠</span>
            <span className="ash-nav-text">Home</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">⚖️</span>
            <span className="ash-nav-text">Balances</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">💳</span>
            <span className="ash-nav-text">Transactions</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">📁</span>
            <span className="ash-nav-text">Directory</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">📦</span>
            <span className="ash-nav-text">Product catalog</span>
          </div>
          
          <div className="ash-nav-section-title">Shortcuts</div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">🛡️</span>
            <span className="ash-nav-text">Fraud tools</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">💻</span>
            <span className="ash-nav-text">Terminal</span>
          </div>
          
          <div className="ash-nav-section-title">Products</div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">🔗</span>
            <span className="ash-nav-text">Connect</span>
            <span className="ash-nav-arrow">▼</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">💳</span>
            <span className="ash-nav-text">Payments</span>
            <span className="ash-nav-arrow">▼</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">🧾</span>
            <span className="ash-nav-text">Billing</span>
            <span className="ash-nav-arrow">▼</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">📊</span>
            <span className="ash-nav-text">Reporting</span>
            <span className="ash-nav-arrow">▼</span>
          </div>
          <div className="ash-nav-item">
            <span className="ash-nav-icon">⋯</span>
            <span className="ash-nav-text">More</span>
            <span className="ash-nav-arrow">▼</span>
          </div>
        </div>

        <div className="ash-nav-bottom">
          <div className="ash-nav-item">
            <span className="ash-nav-icon">👨‍💻</span>
            <span className="ash-nav-text">Developers</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ash-main">
        <div className="ash-header">
          <div className="ash-breadcrumb">
            <span className="ash-breadcrumb-link">Settings</span>
            <span className="ash-breadcrumb-separator">›</span>
          </div>
          <h1 className="ash-page-title">Business</h1>
          
          <div className="ash-tabs">
            <div className="ash-tab">Account details</div>
            <div className="ash-tab ash-tab-active">Account status</div>
            <div className="ash-tab">Business details</div>
            <div className="ash-tab">Bank accounts and currencies</div>
            <div className="ash-tab">Branding</div>
            <div className="ash-tab">Custom domains</div>
            <div className="ash-tab">
              More
              <span className="ash-tab-arrow">▼</span>
            </div>
          </div>
        </div>

        <div className="ash-content">
          <div className="ash-content-main">
            {/* Actions Required Section */}
            {dynamicTasks.length > 0 && (
              <div className="ash-section">
                <div className="ash-section-header">
                  <h2 className="ash-section-title">Actions required</h2>
                  <div className="ash-badge ash-badge-red">{dynamicTasks.length}</div>
                </div>

                <div className="ash-action-list">
                  {dynamicTasks.map((task) => (
                    <div
                      key={task.id}
                      className="ash-action-item"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="ash-action-content">
                        <div className="ash-action-title">{task.title}</div>
                        <div className="ash-action-meta">
                          {task.icon && <span className="ash-action-icon">{task.icon}</span>}
                          {task.status && (
                            <span className={`ash-action-status ${task.status === 'Past due' ? 'ash-status-past-due' : ''}`}>
                              {task.status}
                            </span>
                          )}
                          <span className="ash-action-date">{task.date}</span>
                          <span className="ash-action-separator">•</span>
                          <span className="ash-action-impact">{task.impact}</span>
                        </div>
                      </div>
                      <div className="ash-action-arrow">›</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Content Section */}
            <div className="ash-section">
              <h2 className="ash-section-title">Other content</h2>
              <div className="ash-other-content">
                {/* Placeholder for other content */}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="ash-sidebar-right">
            <div className="ash-capabilities">
              <h3 className="ash-capabilities-title">Capabilities</h3>
              
              <div className="ash-capability-status">
                <div className="ash-capability-indicator ash-capability-warning">
                  <span className="ash-capability-icon">⚠️</span>
                  <span className="ash-capability-text">Paused soon</span>
                </div>
                <div className="ash-capability-links">
                  <a href="#" className="ash-capability-link">Treasury</a>
                  <span className="ash-capability-separator">, </span>
                  <a href="#" className="ash-capability-link">Card issuing</a>
                  <span className="ash-capability-separator">, </span>
                  <a href="#" className="ash-capability-link">Card payments</a>
                  <span className="ash-capability-separator">, </span>
                  <a href="#" className="ash-capability-link">Stripe Tax</a>
                </div>
              </div>
              
              <div className="ash-capability-status">
                <div className="ash-capability-indicator ash-capability-success">
                  <span className="ash-capability-icon">✅</span>
                  <span className="ash-capability-text">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHEntry; 