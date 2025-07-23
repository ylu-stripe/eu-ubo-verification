import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BeneficialOwner } from '../data/mockData';

export interface FlowParameters {
  ubosFound: boolean;
  directorsFound: boolean;
  legalEntityMatch: 'trulioo_stripe' | 'trulioo_no_response' | 'trulioo_not_stripe';
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
  shouldShowDirectors: () => boolean;
  isDirectorsFlow: () => boolean;
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
    legalEntityMatch: 'trulioo_stripe'
  });

  const hasChanges = () => {
    return removedOwners.length > 0 || newOwners.length > 0;
  };

  const hasDirectorChanges = () => {
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

  const shouldShowDirectors = () => {
    return !flowParams.ubosFound && flowParams.directorsFound;
  };

  const isDirectorsFlow = () => {
    return shouldShowDirectors();
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
    shouldShowDirectors,
    isDirectorsFlow,
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