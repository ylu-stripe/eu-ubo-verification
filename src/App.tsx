import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UBOProvider } from './contexts/UBOContext';
import { mockCompanyData } from './data/mockData';
import FlowControlPanel from './components/FlowControlPanel';
import ASHEntry from './components/ASHEntry';
import EditPage from './components/EditPage';
import ConfirmPage from './components/ConfirmPage';
import ConfirmStructure from './components/ConfirmStructure';
import VerifyOwnership from './components/VerifyOwnership';
import NoUBOsTransition from './components/NoUBOsTransition';
import NoUBOsFound from './components/NoUBOsFound';
import CompanyInformation from './components/CompanyInformation';
import OrgTreeBuilder from './components/OrgTreeBuilder';
import VerificationMethod from './components/VerificationMethod';
import DocumentReview from './components/DocumentReview';
import ReviewAttestation from './components/ReviewAttestation';
import EditBusinessStructure from './components/EditBusinessStructure';
import SuccessPage from './components/SuccessPage';
import DocumentReviewPage from './components/DocumentReviewPage';
import KYBVerification from './components/KYBVerification';
import KYBReview from './components/KYBReview';
import KYBSuccess from './components/KYBSuccess';
import './App.css';

const App: React.FC = () => {
  return (
    <UBOProvider initialOwners={mockCompanyData.beneficialOwners} initialDirectors={mockCompanyData.directors}>
      <div className="App">
        <FlowControlPanel />
        <Routes>
          <Route path="/" element={<Navigate to="/ash" replace />} />
          <Route path="/ash" element={<ASHEntry />} />
          <Route path="/kyb-verification" element={<KYBVerification />} />
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
      </div>
    </UBOProvider>
  );
};

export default App; 