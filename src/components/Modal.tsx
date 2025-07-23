import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/ash');
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