// Custom confirmation modal (no browser "says:" message)

export function showConfirm(message, onConfirm, onCancel) {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="confirm-overlay"></div>
    <div class="confirm-dialog">
      <div class="confirm-message">${message}</div>
      <div class="confirm-buttons">
        <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
        <button class="btn btn-danger" id="confirm-ok">Confirm</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Focus on confirm button
  setTimeout(() => {
    modal.querySelector('#confirm-ok').focus();
  }, 100);
  
  // Handle button clicks
  modal.querySelector('#confirm-ok').addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onConfirm) onConfirm();
  });
  
  modal.querySelector('#confirm-cancel').addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onCancel) onCancel();
  });
  
  // Close on overlay click
  modal.querySelector('.confirm-overlay').addEventListener('click', () => {
    document.body.removeChild(modal);
    if (onCancel) onCancel();
  });
  
  // Handle Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(modal);
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

// Add styles for the modal
const style = document.createElement('style');
style.textContent = `
  .confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .confirm-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  }
  
  .confirm-dialog {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
    z-index: 1;
  }
  
  .confirm-message {
    font-size: 1.125rem;
    color: #1e293b;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .confirm-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  
  .confirm-buttons .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }
  
  .confirm-buttons .btn-secondary {
    background: #e2e8f0;
    color: #475569;
  }
  
  .confirm-buttons .btn-secondary:hover {
    background: #cbd5e1;
  }
  
  .confirm-buttons .btn-danger {
    background: #dc2626;
    color: white;
  }
  
  .confirm-buttons .btn-danger:hover {
    background: #b91c1c;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

