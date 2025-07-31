import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';

const OrgTreeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, setActiveOwners, setDirectors } = useUBO();
  const [analysisResult, setAnalysisResult] = useState<'ubos' | 'directors' | null>(null);

  const handleBack = () => {
    navigate('/company-information');
  };

  const handleContinue = () => {
    // Use the user's selected analysis result
    if (analysisResult === 'ubos') {
      // Org tree found UBOs - go to UBOs confirmation flow
      setFlowParams({
        ubosFound: true,
        directorsFound: false,
        legalEntityMatch: 'trulioo_stripe',
        kybComplete: false,
        kybRequiresManualReview: false,
        kybMvrComplete: false,
        kybRequirementComplete: false,
        uboRequirementComplete: false
      });
      // Set some mock UBOs from org tree analysis
      setActiveOwners([
        {
          id: 'orgtree_ubo_1',
          name: 'Ultimate Beneficial Owner 1',
          percentage: 60,
          ownershipType: 'indirect',
        },
        {
          id: 'orgtree_ubo_2', 
          name: 'Ultimate Beneficial Owner 2',
          percentage: 40,
          ownershipType: 'indirect',
        }
             ]);
       navigate('/confirm-owners');
     } else if (analysisResult === 'directors') {
       // Org tree found no UBOs, switch to directors flow
      setFlowParams({
        ubosFound: false,
        directorsFound: true,
        legalEntityMatch: 'trulioo_stripe',
        kybComplete: false,
        kybRequiresManualReview: false,
        kybMvrComplete: false,
        kybRequirementComplete: false,
        uboRequirementComplete: false
      });
      // Set some mock directors from org tree analysis
      setDirectors([
        {
          id: 'orgtree_director_1',
          name: 'Director One',
          percentage: 0,
          ownershipType: 'direct',
          role: 'CEO'
        },
        {
          id: 'orgtree_director_2',
          name: 'Director Two', 
          percentage: 0,
          ownershipType: 'direct',
          role: 'CFO'
        }
      ]);
      navigate('/confirm-directors');
    }
  };

  const handleSimulateUBOs = () => {
    setAnalysisResult('ubos');
  };

  const handleSimulateDirectors = () => {
    setAnalysisResult('directors');
  };

  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Build your ownership tree</h1>
      <p className="page-description">
        We'll help you map out your complex ownership structure to identify your ultimate beneficial owners.
      </p>

      <div className="mb-24">
        <div className="placeholder-content">
          <div className="placeholder-icon">🏗️</div>
          <h3 className="placeholder-title">Org Tree Builder</h3>
          <p className="placeholder-description">
            This is a placeholder for the organizational tree builder flow. This tool will help you:
          </p>
          <ul className="placeholder-list">
            <li>Map complex ownership structures</li>
            <li>Identify intermediate holding companies</li>
            <li>Calculate beneficial ownership percentages</li>
            <li>Determine ultimate beneficial owners</li>
          </ul>
          
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
              Demo: Simulate Analysis Result
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
              For demo purposes, choose what the org tree analysis should find:
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button 
                onClick={handleSimulateUBOs}
                className={`btn btn-small ${analysisResult === 'ubos' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Find UBOs
              </button>
              <button 
                onClick={handleSimulateDirectors}
                className={`btn btn-small ${analysisResult === 'directors' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Find Directors Only
              </button>
            </div>
            {analysisResult && (
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>
                ✓ Analysis will find: {analysisResult === 'ubos' ? 'Ultimate Beneficial Owners' : 'Directors & Officers only'}
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleContinue} 
        disabled={!analysisResult}
        className="btn btn-primary btn-full-width btn-standalone"
      >
        {!analysisResult ? 'Select analysis result above' : 'Continue to results'}
      </button>
    </Modal>
  );
};

export default OrgTreeBuilder; 