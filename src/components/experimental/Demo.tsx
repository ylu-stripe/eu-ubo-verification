import React, { useState } from 'react';
import ConfirmPage from './ConfirmPage';
import EditPage from './EditPage';
import { BeneficialOwner } from './mockData';
import { useUBO } from '../../contexts/UBOContext';

type ViewMode = 'builder' | 'confirm-ubo' | 'edit-ubo' | 'confirm-directors' | 'edit-directors';

interface TestIndividual {
  id: string;
  name: string;
  percentage: number;
  role?: string;
  inPrefill: boolean;
  inAccount: boolean;
}

const Demo: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('builder');
  const [isDirectorsFlow, setIsDirectorsFlow] = useState(false);
  const [testIndividuals, setTestIndividuals] = useState<TestIndividual[]>([
    // Group A: Existing matches (in both prefill and account)
    {
      id: 'default_1',
      name: 'Tony Stark',
      percentage: 40,
      role: 'CEO',
      inPrefill: true,
      inAccount: true
    },
    // Group B: New matches (in prefill only)
    {
      id: 'default_2',
      name: 'Pepper Potts',
      percentage: 35,
      role: 'CFO',
      inPrefill: true,
      inAccount: false
    },
    // Group C: Unexpected owners (in account only)
    {
      id: 'default_3',
      name: 'Bruce Banner',
      percentage: 15,
      role: 'CTO',
      inPrefill: false,
      inAccount: true
    }
  ]);
  const [newIndividual, setNewIndividual] = useState({
    name: '',
    percentage: 25,
    role: '',
    inPrefill: false,
    inAccount: false
  });
  
  const { flowParams, setFlowParams } = useUBO();
  const twoWayMatch = flowParams.twoWayMatch || false;

  const generateBeneficialOwners = (): BeneficialOwner[] => {
    return testIndividuals.map(individual => {
      // Determine owner group based on prefill/account status
      let ownerGroup: 'existing-match' | 'new-match' | 'unexpected' | undefined;
      
      if (twoWayMatch) {
        if (individual.inPrefill && individual.inAccount) {
          ownerGroup = 'existing-match'; // Group A
        } else if (individual.inPrefill && !individual.inAccount) {
          ownerGroup = 'new-match'; // Group B
        } else if (!individual.inPrefill && individual.inAccount) {
          ownerGroup = 'unexpected'; // Group C
        } else {
          // Not in prefill or account - this would be a newly added person
          ownerGroup = 'unexpected';
        }
      }

      return {
        id: individual.id,
        name: individual.name,
        percentage: isDirectorsFlow ? 0 : individual.percentage,
        ownershipType: 'direct' as const,
        role: isDirectorsFlow ? individual.role : undefined,
        isExisting: individual.inAccount,
        ownerGroup,
        isPrefillMatch: individual.inPrefill
      };
    });
  };

  const handleAddIndividual = () => {
    if (!newIndividual.name.trim()) return;

    const individual: TestIndividual = {
      id: `test_${Date.now()}`,
      name: newIndividual.name,
      percentage: newIndividual.percentage,
      role: newIndividual.role || undefined,
      inPrefill: newIndividual.inPrefill,
      inAccount: newIndividual.inAccount
    };

    setTestIndividuals([...testIndividuals, individual]);
    setNewIndividual({
      name: '',
      percentage: 25,
      role: '',
      inPrefill: false,
      inAccount: false
    });
  };

  const handleRemoveIndividual = (id: string) => {
    setTestIndividuals(testIndividuals.filter(ind => ind.id !== id));
  };

  const handleStartFlow = () => {
    setCurrentView(isDirectorsFlow ? 'confirm-directors' : 'confirm-ubo');
  };

  const handleEditFromConfirm = () => {
    setCurrentView(isDirectorsFlow ? 'edit-directors' : 'edit-ubo');
  };

  const handleBackToBuilder = () => {
    setCurrentView('builder');
  };

  if (currentView === 'builder') {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '20px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segui UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              🧪 Sandbox Data Builder
            </h1>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#64748b',
              margin: 0
            }}>
              Build your test scenario and flow through the confirm→edit experience
            </p>
          </div>
        
          {/* Matching Strategy Toggle */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}>
            <div style={{ 
              display: 'inline-block',
              padding: '3px 6px',
              backgroundColor: '#374151',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '3px',
              marginBottom: '8px'
            }}>
              {twoWayMatch ? '2-WAY' : '1-WAY'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 2px 0', 
                  fontSize: '1rem', 
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  Matching Strategy
                </h3>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  {twoWayMatch ? '2-way Matching Active' : '1-way Matching Active'}
                </div>
              </div>
              <button
                onClick={() => {
                  const newTwoWayMatch = !twoWayMatch;
                  setFlowParams({
                    ...flowParams,
                    twoWayMatch: newTwoWayMatch
                  });
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Switch to {twoWayMatch ? '1-way' : '2-way'}
              </button>
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              marginTop: '6px'
            }}>
              {twoWayMatch 
                ? 'Groups: A (prefill+account), B (prefill only), C (account only)' 
                : 'Standard prefill-only approach'
              }
            </div>
          </div>

          {/* Flow Type Toggle */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1rem', 
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Flow Type
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <input 
                  type="radio" 
                  checked={!isDirectorsFlow} 
                  onChange={() => setIsDirectorsFlow(false)}
                />
                📋 Beneficial Owners
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <input 
                  type="radio" 
                  checked={isDirectorsFlow} 
                  onChange={() => setIsDirectorsFlow(true)}
                />
                👥 Directors & Executives
              </label>
            </div>
          </div>

          {/* Add Individual Form */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1rem', 
              fontWeight: '700',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ➕ Add Individual
            </h3>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newIndividual.name}
                  onChange={(e) => setNewIndividual({...newIndividual, name: e.target.value})}
                  placeholder="Enter full name"
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>
              
              {isDirectorsFlow && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Role
                  </label>
                  <input
                    type="text"
                    value={newIndividual.role}
                    onChange={(e) => setNewIndividual({...newIndividual, role: e.target.value})}
                    placeholder="e.g., CEO, Director"
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ 
              marginTop: '12px', 
              display: 'flex', 
              gap: '16px'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  checked={newIndividual.inPrefill}
                  onChange={(e) => setNewIndividual({...newIndividual, inPrefill: e.target.checked})}
                />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '12px' }}>In Prefill</div>
                  {twoWayMatch && (
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      (Groups A+B)
                    </div>
                  )}
                </div>
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  checked={newIndividual.inAccount}
                  onChange={(e) => setNewIndividual({...newIndividual, inAccount: e.target.checked})}
                />
                <div>
                  <div style={{ fontWeight: '500', fontSize: '12px' }}>In Account</div>
                  {twoWayMatch && (
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                      (Groups A+C)
                    </div>
                  )}
                </div>
              </label>
            </div>

            <button
              onClick={handleAddIndividual}
              disabled={!newIndividual.name.trim()}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: newIndividual.name.trim() ? '#374151' : '#e5e7eb',
                color: newIndividual.name.trim() ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: newIndividual.name.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              ➕ Add Individual
            </button>
          </div>

          {/* Current Test Data */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1rem', 
              fontWeight: '700',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📊 Test Data ({testIndividuals.length})
            </h3>
            {testIndividuals.length === 0 ? (
              <div style={{ 
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '2px dashed #cbd5e1'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                <p style={{ 
                  color: '#64748b', 
                  fontStyle: 'italic',
                  fontSize: '12px',
                  margin: 0
                }}>
                  No individuals added yet
                </p>
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: '10px',
                  margin: '4px 0 0 0'
                }}>
                  Add some test individuals above to get started
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {testIndividuals.map((individual) => {
                  const getGroupLabel = () => {
                    if (!twoWayMatch) return null;
                    
                    if (individual.inPrefill && individual.inAccount) {
                      return 'A';
                    } else if (individual.inPrefill && !individual.inAccount) {
                      return 'B';
                    } else if (!individual.inPrefill && individual.inAccount) {
                      return 'C';
                    }
                    return null;
                  };

                  const groupLabel = getGroupLabel();

                  return (
                    <div key={individual.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px', 
                      backgroundColor: '#f9fafb',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13px', color: '#1f2937' }}>{individual.name}</strong>
                          {groupLabel && (
                            <span style={{
                              padding: '1px 4px',
                              borderRadius: '2px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              fontSize: '9px',
                              fontWeight: '600'
                            }}>
                              GROUP {groupLabel}
                            </span>
                          )}
                          {isDirectorsFlow && individual.role && (
                            <span style={{ 
                              color: '#64748b',
                              fontSize: '11px',
                              fontStyle: 'italic'
                            }}>
                              {individual.role}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ 
                            fontSize: '10px',
                            color: '#6b7280'
                          }}>
                            Prefill: {individual.inPrefill ? '✓' : '✗'}
                          </span>
                          <span style={{ 
                            fontSize: '10px',
                            color: '#6b7280'
                          }}>
                            Account: {individual.inAccount ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveIndividual(individual.id)}
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#dc2626',
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Start Flow Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={handleStartFlow}
              disabled={testIndividuals.length === 0}
              style={{
                padding: '8px 20px',
                backgroundColor: testIndividuals.length > 0 ? '#374151' : '#e5e7eb',
                color: testIndividuals.length > 0 ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: testIndividuals.length > 0 ? 'pointer' : 'not-allowed'
              }}
            >
              🚀 Start {isDirectorsFlow ? 'Directors' : 'Beneficial Owner'} Flow
            </button>
            </div>
        </div>
      </div>
    );
  }

  const currentData = generateBeneficialOwners();

  return (
    <div>
      <button 
        onClick={handleBackToBuilder}
        style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '20px', 
          zIndex: 10000,
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        ← Back to Builder
      </button>

      {(currentView === 'confirm-ubo' || currentView === 'confirm-directors') && (
        <ConfirmPage 
          isDirectorsFlow={isDirectorsFlow}
          initialData={currentData}
          twoWayMatch={twoWayMatch}
          onEdit={handleEditFromConfirm}
        />
      )}
      
      {(currentView === 'edit-ubo' || currentView === 'edit-directors') && (
        <EditPage 
          isDirectorsFlow={isDirectorsFlow}
          initialData={currentData}
          twoWayMatch={twoWayMatch}
          onSave={(items) => {
            console.log('Final saved data:', items);
            handleBackToBuilder();
          }}
        />
      )}
    </div>
  );
};

export default Demo; 