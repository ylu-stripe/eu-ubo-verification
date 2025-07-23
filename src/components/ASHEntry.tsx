import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';

const ASHEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { resetState, verificationMethod, shouldShowKYB, shouldShowUBO } = useUBO();

  // Auto-reset flow when returning to ASH after completing verification
  useEffect(() => {
    const completedParam = searchParams.get('completed');
    
    if (completedParam === 'true' && verificationMethod !== null) {
      // Reset the flow state so they start fresh next time
      resetState();
      // Clean up the URL parameter
      setSearchParams({});
    }
  }, [searchParams, verificationMethod, resetState, setSearchParams]);

  const handleTaskClick = (taskId: string) => {
    if (taskId === 'task_kyb') {
      navigate('/kyb-verification');
    } else if (taskId === 'task_ubo') {
      navigate('/verify-ownership?entry=ash');
    }
    // Other tasks would be handled here
  };

  // Build dynamic task list based on flow state
  const getTasks = () => {
    const tasks = [];
    
    if (shouldShowKYB()) {
      tasks.push({
        id: 'task_kyb',
        title: 'Verify business information',
        dueDate: 'Jan 24, 2025',
        condition: 'Required for EU compliance',
        impact: 'account access, payments',
        type: 'urgent',
        clickable: true,
        icon: '🏢'
      });
    }
    
    if (shouldShowUBO()) {
      tasks.push({
        id: 'task_ubo',
        title: 'Verify beneficial ownership information',
        dueDate: 'Jan 24, 2025',
        condition: 'Required for EU compliance',
        impact: 'account access, payments',
        type: 'urgent',
        clickable: true,
        icon: '👥'
      });
    }
    
    return tasks;
  };

  const mockTasks = getTasks();

  const navItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Customers', icon: '👥' },
    { name: 'Payments', icon: '💳' },
    { name: 'Balances', icon: '💰' },
    { name: 'Connect', icon: '🔗' },
    { name: 'Billing', icon: '📊' },
    { name: 'Developers', icon: '⚙️' }
  ];

  return (
    <div className="ash-dashboard">
      {/* Sidebar */}
      <div className="ash-sidebar">
        <div className="ash-sidebar-header">
          <div className="ash-brand">
            <div className="ash-brand-icon">S</div>
            <div className="ash-brand-name">Stripe</div>
          </div>
        </div>
        <div className="ash-nav">
          <div className="ash-nav-section">
            {navItems.map((item, index) => (
              <div 
                key={index} 
                className={`ash-nav-item ${item.name === 'Home' ? 'active' : ''}`}
              >
                <div className="ash-nav-icon">{item.icon}</div>
                <div className="ash-nav-text">{item.name}</div>
              </div>
            ))}
          </div>
          <div className="ash-nav-bottom">
            <div className="ash-nav-item">
              <div className="ash-nav-icon">❓</div>
              <div className="ash-nav-text">Help & Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ash-main">
        <div className="ash-header">
          <div className="ash-breadcrumb">Home</div>
          <h1 className="ash-title">Account Status Home</h1>
          <div className="ash-tabs">
            <div className="ash-tab ash-tab-active">Overview</div>
            <div className="ash-tab">Tasks</div>
            <div className="ash-tab">Reports</div>
          </div>
        </div>

        <div className="ash-content">
          <div className="ash-content-main">
            {/* Urgent Tasks Section */}
            <div className="ash-section">
              <div className="ash-section-header">
                <h2 className="ash-section-title">Urgent tasks</h2>
                <div className="ash-badge ash-badge-red">1</div>
              </div>
              
              <div className="ash-status-badges">
                <div className="ash-status-badge ash-status-badge-red">
                  Due Jan 24
                </div>
              </div>

              <div className="ash-task-list">
                {mockTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="ash-task-item urgent" 
                    onClick={() => task.clickable && handleTaskClick(task.id)}
                    style={{ cursor: task.clickable ? 'pointer' : 'default' }}
                  >
                    <div className="ash-task-icon">{task.icon}</div>
                    <div className="ash-task-content">
                      <div className="ash-task-title">{task.title}</div>
                      <div className="ash-task-meta">
                        <span className="ash-task-condition">{task.condition}</span>
                        <span className="ash-task-impact">Impacts: {task.impact}</span>
                      </div>
                    </div>
                    <div className="ash-task-action">
                      <button className="ash-task-button">
                        {task.clickable ? 'Complete task' : 'View details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Information Section */}
            <div className="ash-section">
              <div className="ash-section-header">
                <h2 className="ash-section-title">Account information</h2>
              </div>
              
              <div className="ash-info-grid">
                <div className="ash-info-card">
                  <div className="ash-info-title">Business details</div>
                  <div className="ash-info-content">
                    <div className="ash-info-item">
                      <span className="ash-info-label">Legal name:</span>
                      <span className="ash-info-value">Acme Corporation</span>
                    </div>
                    <div className="ash-info-item">
                      <span className="ash-info-label">Business type:</span>
                      <span className="ash-info-value">Private limited company</span>
                    </div>
                    <div className="ash-info-item">
                      <span className="ash-info-label">Country:</span>
                      <span className="ash-info-value">Netherlands</span>
                    </div>
                  </div>
                </div>

                <div className="ash-info-card">
                  <div className="ash-info-title">Verification status</div>
                  <div className="ash-info-content">
                    <div className="ash-info-item">
                      <span className="ash-info-label">Identity:</span>
                      <span className="ash-info-value verified">Verified</span>
                    </div>
                    <div className="ash-info-item">
                      <span className="ash-info-label">Business:</span>
                      <span className="ash-info-value pending">Pending</span>
                    </div>
                    <div className="ash-info-item">
                      <span className="ash-info-label">Bank account:</span>
                      <span className="ash-info-value verified">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ash-sidebar-right">
            <div className="ash-section">
              <div className="ash-section-header">
                <h2 className="ash-section-title">Quick actions</h2>
              </div>
              
              <div className="ash-quick-actions">
                <button className="ash-quick-action">
                  <div className="ash-quick-action-icon">💳</div>
                  <div className="ash-quick-action-text">Create payment</div>
                </button>
                <button className="ash-quick-action">
                  <div className="ash-quick-action-icon">👥</div>
                  <div className="ash-quick-action-text">Add customer</div>
                </button>
                <button className="ash-quick-action">
                  <div className="ash-quick-action-icon">📊</div>
                  <div className="ash-quick-action-text">View reports</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHEntry; 