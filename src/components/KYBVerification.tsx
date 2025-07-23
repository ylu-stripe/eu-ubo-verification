import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUBO } from '../contexts/UBOContext';
import Modal from './Modal';

const KYBVerification: React.FC = () => {
  const navigate = useNavigate();
  const { flowParams, setFlowParams } = useUBO();
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessType: '',
    taxId: '',
    phone: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/ash');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (flowParams.kybRequiresManualReview) {
      // Manual review path - go to review page
      setFlowParams({
        ...flowParams,
        kybComplete: true
      });
      navigate('/kyb-review');
    } else {
      // Automatic verification path - go to success with UBO continuation
      setFlowParams({
        ...flowParams,
        kybComplete: true
      });
      navigate('/kyb-success');
    }
  };

  const isFormValid = formData.businessName && formData.businessAddress && formData.taxId;

  return (
    <Modal title="Verify business information">
      <button className="btn-back mb-24" onClick={handleBack}>
        ← Back
      </button>

      <h1 className="page-title">Verify your business information</h1>
      <p className="page-description">
        We need to verify some basic information about your business to comply with regulatory requirements.
      </p>

      <div className="form-container">
        <div className="form-field">
          <label className="form-label">Business name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="Enter your legal business name"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Business address *</label>
          <input
            type="text"
            className="form-input"
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            placeholder="Enter your business address"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Business type</label>
          <select
            className="form-input"
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
          >
            <option value="">Select business type</option>
            <option value="corporation">Corporation</option>
            <option value="llc">LLC</option>
            <option value="partnership">Partnership</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Tax ID / Registration number *</label>
          <input
            type="text"
            className="form-input"
            value={formData.taxId}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="Enter your tax ID or registration number"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Business phone</label>
          <input
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your business phone number"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Business website</label>
          <input
            type="url"
            className="form-input"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="Enter your business website URL"
          />
        </div>
      </div>

      <div className="form-disclaimer mb-32">
        <p className="disclaimer-text">
          By submitting this information, you confirm that it is accurate and up to date. This information will be used for verification purposes only.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        className="btn btn-primary btn-full-width btn-standalone"
      >
        {isSubmitting ? 'Submitting...' : 'Submit verification'}
      </button>
    </Modal>
  );
};

export default KYBVerification; 