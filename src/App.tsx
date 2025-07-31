import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UBOProvider } from './contexts/UBOContext';
import { mockCompanyData } from './data/mockData';
import FlowControlPanel from './components/admin/FlowControlPanel';
import PageSpecificModifiers from './components/admin/PageSpecificModifiers';
import ASHEntry from './components/ASHEntry';
import EditPage from './components/flows/ubo/EditPage';
import ConfirmPage from './components/flows/ubo/ConfirmPage';
import ConfirmStructure from './components/flows/ubo/ConfirmStructure';
import VerifyOwnership from './components/flows/verification/VerifyOwnership';
import NoUBOsTransition from './components/flows/no-ubos/NoUBOsTransition';
import NoUBOsFound from './components/flows/no-ubos/NoUBOsFound';
import CompanyInformation from './components/flows/ubo/CompanyInformation';
import OrgTreeBuilder from './components/flows/org-tree/OrgTreeBuilder';
import VerificationMethod from './components/flows/verification/VerificationMethod';
import DocumentReview from './components/flows/verification/DocumentReview';
import ReviewAttestation from './components/flows/verification/ReviewAttestation';
import EditBusinessStructure from './components/flows/ubo/EditBusinessStructure';
import SuccessPage from './components/flows/ubo/SuccessPage';
import DocumentReviewPage from './components/flows/verification/DocumentReviewPage';
import KYBVerification from './components/flows/kyb/KYBVerification';
import KYBReview from './components/flows/kyb/KYBReview';
import KYBSuccess from './components/flows/kyb/KYBSuccess';
import KYBDocumentUpload from './components/flows/kyb/KYBDocumentUpload';
import ExperimentalDemo from './components/experimental/Demo';
import { useUBO } from './contexts/UBOContext';
import './App.css';

const AppContent: React.FC = () => {
  const { sandboxMode } = useUBO();

  return (
    <div className={`App ${sandboxMode ? 'sandbox-active' : ''}`}>
      {/* Sandbox Mode Indicator */}
      {sandboxMode && (
        <div className="sandbox-mode-banner">
          🧪 SANDBOX MODE - Using Experimental Components
        </div>
      )}
      
      <FlowControlPanel />
      <PageSpecificModifiers />
      
      {sandboxMode ? (
        // Sandbox Mode: Show experimental components
        <ExperimentalDemo />
      ) : (
        // Regular Mode: Show normal app routes
        <Routes>
          <Route path="/" element={<Navigate to="/ash" replace />} />
          <Route path="/ash" element={<ASHEntry />} />
          <Route path="/kyb-verification" element={<KYBVerification />} />
          <Route path="/kyb-document-upload" element={<KYBDocumentUpload />} />
          <Route path="/kyb-review" element={<KYBReview />} />
          <Route path="/kyb-success" element={<KYBSuccess />} />
          <Route path="/edit-owners" element={<EditPage />} />
          <Route path="/confirm-owners" element={<ConfirmPage />} />
          <Route path="/confirm-structure" element={<ConfirmStructure />} />
          <Route path="/verify-ownership" element={<VerifyOwnership />} />
          <Route path="/confirm-directors" element={<ConfirmPage />} />
          <Route path="/edit-directors" element={<EditPage />} />
          <Route path="/no-ubos-transition" element={<NoUBOsTransition />} />
          <Route path="/no-ubos-found" element={<NoUBOsFound />} />
          <Route path="/company-information" element={<CompanyInformation />} />
          <Route path="/org-tree-builder" element={<OrgTreeBuilder />} />
          <Route path="/verification-method" element={<VerificationMethod />} />
          <Route path="/document-review" element={<DocumentReview />} />
          <Route path="/review-attestation" element={<ReviewAttestation />} />
          <Route path="/edit-business-structure" element={<EditBusinessStructure />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/document-review-status" element={<DocumentReviewPage />} />
        </Routes>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UBOProvider initialOwners={mockCompanyData.beneficialOwners} initialDirectors={mockCompanyData.directors}>
      <AppContent />
    </UBOProvider>
  );
};

export default App; 