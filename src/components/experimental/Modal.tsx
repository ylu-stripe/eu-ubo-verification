import React from 'react';

interface ModalProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // For experimental version, just close without navigation
      console.log('Modal close clicked');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <div className="modal-title">{title}</div>
        <button className="btn-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default Modal; 