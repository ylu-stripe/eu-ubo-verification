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
import EditBusinessStructure from './components/flows/ubo/EditBusinessStructure';
import SuccessPage from './components/flows/ubo/SuccessPage';
import DocumentReviewPage from './components/flows/verification/DocumentReviewPage';
import ReviewAndSign from './components/flows/verification/ReviewAndSign';
import UploadDocuments from './components/flows/verification/UploadDocuments';

import './App.css';

const AppContent: React.FC = () => {
  return (
    <div className="App">
      <FlowControlPanel />
      <PageSpecificModifiers />
      
      <Routes>
        <Route path="/" element={<Navigate to="/ash" replace />} />
        <Route path="/ash" element={<ASHEntry />} />

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
        <Route path="/edit-business-structure" element={<EditBusinessStructure />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/document-review-status" element={<DocumentReviewPage />} />
        <Route path="/review-and-sign" element={<ReviewAndSign />} />
        <Route path="/upload-documents" element={<UploadDocuments />} />
      </Routes>
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