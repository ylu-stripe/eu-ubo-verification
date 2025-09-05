import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../../../contexts/UBOContext';
import Modal from '../../ui/Modal';
import PageHeader from '../../ui/PageHeader';
import PeopleList from '../../ui/PeopleList';

const UploadDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { activeOwners, directors, isDirectorsFlow } = useUBO();
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('passport');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showPlaceholderFile, setShowPlaceholderFile] = useState<boolean>(false);

  const isDirectors = isDirectorsFlow();
  const currentList = isDirectors ? directors : activeOwners;

  const documentTypes = [
    {
      id: 'passport',
      title: 'Passport',
      description: 'Some description here.'
    },
    {
      id: 'drivers-license',
      title: 'Driver\'s license',
      description: 'Some description here.'
    },
    {
      id: 'national-id',
      title: 'National ID',
      description: 'Contains X,Y,Z. View sample.',
      hasViewSample: true
    }
  ];

  const handleBack = () => {
    navigate('/verification-method');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowPlaceholderFile(true);
  };

  const handleSelectFileClick = () => {
    setShowPlaceholderFile(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowPlaceholderFile(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleContinue = () => {
    // Navigate to the review status page after upload
    navigate('/document-review-status');
  };

  const handleRemoveFile = () => {
    setShowPlaceholderFile(false);
    setUploadedFiles([]);
  };

  return (
    <>
      <Modal title={isDirectors ? "Activate payments" : "Verify ownership"}>
        <button className="btn-back mb-24" onClick={handleBack}>
          ← Back
        </button>

        <div className="content-section">
          <PageHeader
            title="Upload an ownership document"
            description={`Upload documents to verify the information on your account. The information printed on the document must match what was entered in your account details.`}
          />

          {/* Reference Data Section */}
          <div>
            <h3 className="section-title">Your document must match these details</h3>
            <PeopleList
              title={isDirectors ? "Directors" : "Beneficial owners"}
              people={currentList}
              showCount={false}
              showRoles={false}
            />
          </div>

          {/* Document Type Selection */}
          <div>
            <h3 className="section-title">Select a document to upload</h3>
            <p className="section-subtitle">Select from a list of supported ID types</p>
            
            <div className="document-type-options">
              {documentTypes.map((docType) => (
                <div 
                  key={docType.id}
                  className={`document-type-option ${selectedDocumentType === docType.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDocumentType(docType.id)}
                >
                  <div className="document-type-radio">
                    <div className={`radio-dot ${selectedDocumentType === docType.id ? 'active' : ''}`} />
                  </div>
                  <div className="document-type-info">
                    <div className="document-type-title">{docType.title}</div>
                    <div className="document-type-description">
                      {docType.hasViewSample ? (
                        <>
                          Contains X,Y,Z. <span className="view-sample">View sample.</span>
                        </>
                      ) : (
                        docType.description
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          {!showPlaceholderFile ? (
            <div 
              className="upload-dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="upload-dropzone-content">
                <button className="btn btn-primary upload-btn" onClick={handleSelectFileClick}>
                  Choose file
                </button>
                <span className="upload-or-text">or drag and drop file here</span>
              </div>
              <input
                type="file"
                className="upload-input"
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
              />
            </div>
          ) : (
            <div className="document-preview">
              <div className="document-preview-header">
                <div className="document-preview-info">
                  <div className="document-icon">📄</div>
                  <span className="document-filename">
                    {uploadedFiles.length > 0 ? uploadedFiles[0].name : 'SS-4.png'}
                  </span>
                </div>
                <button className="document-remove-btn" onClick={handleRemoveFile}>
                  ×
                </button>
              </div>
              <div className="document-preview-content">
                <div className="document-preview-image">
                  <div className="document-preview-placeholder">
                    <div className="document-preview-text">Document Preview</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="upload-instructions">
            Provide a clear, complete, and uncropped document in JPG, PNG, or PDF format, avoiding grayscale scans and photos of photos.
          </p>


          <button
            onClick={handleContinue}
            className="btn btn-primary btn-full-width btn-standalone"
            disabled={!showPlaceholderFile && uploadedFiles.length === 0}
          >
            Continue
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UploadDocuments;