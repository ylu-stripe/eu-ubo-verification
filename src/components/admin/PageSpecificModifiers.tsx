import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUBO } from '../../contexts/UBOContext';

const PageSpecificModifiers: React.FC = () => {
  const location = useLocation();
  const { flowParams, setFlowParams } = useUBO();
  
  // Local state for live page modifiers (don't affect global flow state until applied)
  const [pageModifiers, setPageModifiers] = useState({
    legalEntityMatch: flowParams.legalEntityMatch
  });

  // Reset page modifiers when navigating to a new page
  useEffect(() => {
    setPageModifiers({
      legalEntityMatch: flowParams.legalEntityMatch
    });
  }, [location.pathname, flowParams.legalEntityMatch]);

  // Apply modifier changes immediately to the global state for live preview
  const handleModifierChange = (key: string, value: any) => {
    const newModifiers = { ...pageModifiers, [key]: value };
    setPageModifiers(newModifiers);
    
    // Apply immediately for live preview
    setFlowParams({
      ...flowParams,
      [key]: value
    });
  };

  // Get page-specific modifiers based on current route
  const getPageModifiers = () => {
    switch (location.pathname) {
      case '/confirm-structure':
        return [
          {
            section: 'Legal Entity',
            modifiers: [
              {
                id: 'trulioo_stripe_no_response',
                label: 'Trulioo = Stripe, and No Response',
                type: 'checkbox',
                checked: pageModifiers.legalEntityMatch === 'trulioo_no_response',
                onChange: (checked: boolean) => {
                  if (checked) {
                    handleModifierChange('legalEntityMatch', 'trulioo_no_response');
                  } else {
                    handleModifierChange('legalEntityMatch', 'trulioo_stripe');
                  }
                }
              },
              {
                id: 'trulioo_not_stripe',
                label: 'Trulioo ≠ Stripe',
                type: 'checkbox',
                checked: pageModifiers.legalEntityMatch === 'trulioo_not_stripe',
                onChange: (checked: boolean) => {
                  if (checked) {
                    handleModifierChange('legalEntityMatch', 'trulioo_not_stripe');
                  } else {
                    handleModifierChange('legalEntityMatch', 'trulioo_stripe');
                  }
                }
              }
            ]
          }
        ];
      
      default:
        return [];
    }
  };

  const pageModifierSections = getPageModifiers();

  // Don't render if no page-specific modifiers for current page
  if (pageModifierSections.length === 0) {
    return null;
  }

  return (
    <div className="page-specific-modifiers">
      <h3 className="modifiers-title">📄 Page-Specific Modifiers</h3>
      <div className="modifiers-page-indicator">
        <span className="page-name">
          {location.pathname === '/confirm-structure' ? 'Confirm Structure' : 'Current Page'}
        </span>
      </div>
      
      {pageModifierSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="modifier-section">
          <h4 className="modifier-section-title">{section.section}:</h4>
          
          <div className="modifier-list">
            {section.modifiers.map((modifier) => (
              <div key={modifier.id} className="modifier-item">
                <label className="modifier-checkbox">
                  <input
                    type="checkbox"
                    checked={modifier.checked}
                    onChange={(e) => modifier.onChange(e.target.checked)}
                  />
                  <span className="modifier-checkmark"></span>
                  <span className="modifier-label">{modifier.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="modifier-status">
        <span className="live-indicator">🔴 LIVE</span>
        <span className="live-text">Changes affect page immediately</span>
      </div>
    </div>
  );
};

export default PageSpecificModifiers; 