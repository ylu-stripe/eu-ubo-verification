import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BeneficialOwner } from '../data/mockData';

export interface FlowParameters {
  ubosFound: boolean;
  directorsFound: boolean;
  legalEntityMatch: 'trulioo_stripe' | 'trulioo_no_response' | 'trulioo_not_stripe';
  kybComplete: boolean;
  kybRequiresManualReview: boolean;
  kybMvrComplete: boolean;
}

interface UBOContextType {
  activeOwners: BeneficialOwner[];
  removedOwners: BeneficialOwner[];
  newOwners: BeneficialOwner[];
  directors: BeneficialOwner[];
  flowParams: FlowParameters;
  verificationMethod: 'electronic' | 'upload' | null;
  setActiveOwners: (owners: BeneficialOwner[]) => void;
  setRemovedOwners: (owners: BeneficialOwner[]) => void;
  setNewOwners: (owners: BeneficialOwner[]) => void;
  setDirectors: (directors: BeneficialOwner[]) => void;
  setFlowParams: (params: FlowParameters) => void;
  setVerificationMethod: (method: 'electronic' | 'upload' | null) => void;
  hasChanges: () => boolean;
  hasDirectorChanges: () => boolean;
  resetState: () => void;
  resetDirectorsForFlow: () => void;
  shouldShowDirectors: () => boolean;
  isDirectorsFlow: () => boolean;
  shouldShowKYB: () => boolean;
  shouldShowUBO: () => boolean;
}

const UBOContext = createContext<UBOContextType | undefined>(undefined);

interface UBOProviderProps {
  children: ReactNode;
  initialOwners: BeneficialOwner[];
  initialDirectors: BeneficialOwner[];
}

export const UBOProvider: React.FC<UBOProviderProps> = ({ children, initialOwners, initialDirectors }) => {
  const [activeOwners, setActiveOwners] = useState<BeneficialOwner[]>(initialOwners);
  const [removedOwners, setRemovedOwners] = useState<BeneficialOwner[]>([]);
  const [newOwners, setNewOwners] = useState<BeneficialOwner[]>([]);
  const [directors, setDirectors] = useState<BeneficialOwner[]>(initialDirectors);
  const [verificationMethod, setVerificationMethod] = useState<'electronic' | 'upload' | null>(null);
  const [flowParams, setFlowParams] = useState<FlowParameters>({
    ubosFound: true,
    directorsFound: true,
    legalEntityMatch: 'trulioo_stripe',
    kybComplete: false,
    kybRequiresManualReview: false,
    kybMvrComplete: false
  });

  const hasChanges = () => {
    return removedOwners.length > 0 || newOwners.length > 0;
  };

  const hasDirectorChanges = () => {
    // If flow says no directors found, empty directors array is not a change
    if (!flowParams.directorsFound && directors.length === 0) {
      return false;
    }
    
    // Check if directors list has changed from initial
    if (directors.length !== initialDirectors.length) return true;
    
    // Check if any director was removed or added
    const hasRemovedDirectors = initialDirectors.some(initial => 
      !directors.find(current => current.id === initial.id)
    );
    const hasNewDirectors = directors.some(current => 
      !initialDirectors.find(initial => initial.id === current.id)
    );
    
    return hasRemovedDirectors || hasNewDirectors;
  };

  const resetDirectorsForFlow = () => {
    // Clear directors array for "no directors found" flow
    setDirectors([]);
  };

  const shouldShowDirectors = () => {
    // Show directors flow when no UBOs found (regardless of directors pre-fill status)
    return !flowParams.ubosFound;
  };

  const isDirectorsFlow = () => {
    return shouldShowDirectors();
  };

  const shouldShowKYB = () => {
    // Show KYB task when KYB is not complete
    return !flowParams.kybComplete;
  };

  const shouldShowUBO = () => {
    // Show UBO task when KYB is complete
    if (!flowParams.kybComplete) return false;
    
    // If KYB required manual review, only show UBO after MVR is complete
    if (flowParams.kybRequiresManualReview && !flowParams.kybMvrComplete) {
      return false;
    }
    
    return true;
  };

  const resetState = () => {
    setActiveOwners(initialOwners);
    setRemovedOwners([]);
    setNewOwners([]);
    setDirectors(initialDirectors);
    setVerificationMethod(null);
  };

  const value = {
    activeOwners,
    removedOwners,
    newOwners,
    directors,
    flowParams,
    verificationMethod,
    setActiveOwners,
    setRemovedOwners,
    setNewOwners,
    setDirectors,
    setFlowParams,
    setVerificationMethod,
    hasChanges,
    hasDirectorChanges,
    resetState,
    resetDirectorsForFlow,
    shouldShowDirectors,
    isDirectorsFlow,
    shouldShowKYB,
    shouldShowUBO
  };

  return <UBOContext.Provider value={value}>{children}</UBOContext.Provider>;
};

export const useUBO = () => {
  const context = useContext(UBOContext);
  if (context === undefined) {
    throw new Error('useUBO must be used within a UBOProvider');
  }
  return context;
}; 