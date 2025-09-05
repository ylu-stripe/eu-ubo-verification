import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import orgTreeImage from '../../../orgtree.png';
import PageHeader from '../../ui/PageHeader';

const OrgTreeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { setFlowParams, setActiveOwners, setDirectors } = useUBO();

  const handleBack = () => {
    navigate('/company-information');
  };

  const handleContinue = () => {
    // Default to UBOs flow with prefilled owners
    setFlowParams({
      ubosFound: true,
      directorsFound: false,
      legalEntityMatch: 'trulioo_stripe',
      uboRequirementComplete: false,
      dataSource: 'org_tree'
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
  };


  return (
    <Modal title="Verify ownership">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <div className="content-section">
        <PageHeader title="Build your ownership tree" description="We'll help you map out your complex ownership structure to identify your ultimate beneficial owners." />
        

        <div className="org-tree-builder-container">
          <div className="placeholder-banner">
            <div className="placeholder-banner-content">
              <div className="placeholder-banner-icon">🚧</div>
              <div className="placeholder-banner-text">
                <div className="placeholder-banner-title">Placeholder Flow</div>
                <div className="placeholder-banner-description">
                  This is a placeholder for the organizational tree builder. The actual tool will help you map complex ownership structures.
                </div>
              </div>
            </div>
          </div>
          
          <div className="org-tree-image-container">
            <img 
              src={orgTreeImage} 
              alt="Organizational tree visualization" 
              className="org-tree-image"
            />
          </div>
        </div>

       
        <button
          onClick={handleContinue}
          className="btn btn-primary btn-full-width btn-standalone"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default OrgTreeBuilder; 