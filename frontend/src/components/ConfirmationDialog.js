import React from 'react';

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="dialog-btn confirm" onClick={onConfirm}>Yes</button>
          <button className="dialog-btn cancel" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;