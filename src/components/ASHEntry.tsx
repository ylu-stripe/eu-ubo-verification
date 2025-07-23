import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';

const ASHEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { resetState, verificationMethod } = useUBO();

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
    if (taskId === 'task_ubo') {
      navigate('/verify-ownership?entry=ash');
    }
    // Other tasks would be handled here
  };

  const mockTasks = [

    {
      id: 'task_ubo',
      title: 'Verify beneficial ownership information',
      dueDate: 'Jan 24, 2025',
      condition: 'Required for EU compliance',
      impact: 'account access, payments',
      type: 'urgent',
      clickable: true,
      icon: '👥'
    },

  ];

  const navItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Balances', icon: '💰' },
    { name: 'Transactions', icon: '📊' },
    { name: 'Directory', icon: '👥' },
    { name: 'Product catalog', icon: '📦' }
  ];

  const shortcuts = [
    { name: 'Fraud tools', icon: '🛡️' },
    { name: 'Terminal', icon: '💳' }
  ];

  const products = [
    { name: 'Connect', icon: '🔗' },
    { name: 'Payments', icon: '💸' },
    { name: 'Billing', icon: '🧾' },
    { name: 'Reporting', icon: '📈' },
    { name: 'More', icon: '⋯' }
  ];

  return (
    <div className="ash-dashboard">
      {/* Left Navigation */}
      <div className="ash-sidebar">
        <div className="ash-sidebar-header">
          <div className="ash-brand">
            <div className="ash-brand-icon">🌵</div>
            <span className="ash-brand-name">Cactus Practice</span>
          </div>
        </div>
        
        <nav className="ash-nav">
          <div className="ash-nav-section">
            {navItems.map((item) => (
              <div key={item.name} className="ash-nav-item">
                <span className="ash-nav-icon">{item.icon}</span>
                <span className="ash-nav-text">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="ash-nav-section">
            <div className="ash-nav-section-title">Shortcuts</div>
            {shortcuts.map((item) => (
              <div key={item.name} className="ash-nav-item">
                <span className="ash-nav-icon">{item.icon}</span>
                <span className="ash-nav-text">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="ash-nav-section">
            <div className="ash-nav-section-title">Products</div>
            {products.map((item) => (
              <div key={item.name} className="ash-nav-item">
                <span className="ash-nav-icon">{item.icon}</span>
                <span className="ash-nav-text">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="ash-nav-bottom">
            <div className="ash-nav-item">
              <span className="ash-nav-icon">👨‍💻</span>
              <span className="ash-nav-text">Developers</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ash-main">
        {/* Header */}
        <div className="ash-header">
          <div className="ash-breadcrumb">Settings ›</div>
          <h1 className="ash-title">Business</h1>
          
          {/* Tabs */}
          <div className="ash-tabs">
            {['Account details', 'Account status', 'Business details', 'Bank accounts and currencies', 'Branding', 'Custom domains', 'More'].map((tab, index) => (
              <div 
                key={tab}
                className={`ash-tab ${index === 1 ? 'ash-tab-active' : ''}`}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div className="ash-content">
          {/* Left Column */}
          <div className="ash-content-main">
            {/* Actions Required */}
            <div className="ash-section">
              <div className="ash-section-header">
                <h2 className="ash-section-title">Actions required</h2>
                <span className="ash-badge ash-badge-red">1</span>
              </div>

   

              {/* Task List */}
              <div className="ash-task-list">
                {mockTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`ash-task ${task.clickable ? 'ash-task-clickable' : ''}`}
                    onClick={task.clickable ? () => handleTaskClick(task.id) : undefined}
                  >
                    <div className="ash-task-content">
                      <div className="ash-task-title">{task.title}</div>
                      
                      <div className="ash-task-meta">
                        {task.dueDate && (
                          <span className="ash-task-date">
                            📅 Due {task.dueDate}
                            {task.type === 'past_due' && (
                              <span className="ash-task-past-due">Past due</span>
                            )}
                          </span>
                        )}
                        <span className="ash-task-impact">• Impacts {task.impact}</span>
                      </div>
                      
                      {task.condition && (
                        <div className="ash-task-condition">
                          📋 {task.condition}
                        </div>
                      )}
                    </div>
                    
                    {task.clickable && (
                      <div className="ash-task-arrow">›</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Other Content */}
            <div className="ash-section">
              <h2 className="ash-section-title">Other content</h2>
              <div className="ash-other-content" />
            </div>
          </div>

          {/* Right Column - Capabilities */}
          <div className="ash-sidebar-right">
            <h2 className="ash-section-title">Capabilities</h2>
            
            <div className="ash-capability-card ash-capability-warning">
              <div className="ash-capability-header">
                <span className="ash-capability-icon">⚠</span>
                <span className="ash-capability-status">Paused soon</span>
              </div>
              
              <div className="ash-capability-items">
                <a href="#" className="ash-capability-link">Treasury</a>,{' '}
                <a href="#" className="ash-capability-link">Card Issuing</a>,{' '}
                <a href="#" className="ash-capability-link">Card payments</a>,{' '}
                <a href="#" className="ash-capability-link">Stripe Tax</a>
              </div>
            </div>

            <div className="ash-capability-card ash-capability-active">
              <div className="ash-capability-header">
                <span className="ash-capability-icon">●</span>
                <span className="ash-capability-status">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHEntry; 