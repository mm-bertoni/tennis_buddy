// Edit reservation modal

import { patch } from '../api/http.js';
import { getCourts } from '../api/courtsApi.js';
import { getReservation } from '../api/reservationsApi.js';

export async function showEditReservationModal(reservationId) {
  try {
    // Fetch reservation details and available courts
    const [reservation, courts] = await Promise.all([
      getReservation(reservationId),
      getCourts()
    ]);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-overlay"></div>
      <div class="edit-dialog">
        <div class="edit-header">
          <h3>Edit Reservation</h3>
          <button class="close-btn" id="close-modal">&times;</button>
        </div>
        <form id="edit-form">
          <div class="form-group">
            <label for="edit-court">Court</label>
            <select id="edit-court" required>
              ${courts.map(court => `
                <option value="${court._id}" ${court._id === reservation.courtId ? 'selected' : ''}>
                  ${court.name} - ${court.location}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label for="edit-date">Date</label>
            <input type="date" id="edit-date" value="${reservation.date}" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="edit-start">Start Time</label>
              <input type="time" id="edit-start" value="${reservation.start}" required />
            </div>
            
            <div class="form-group">
              <label for="edit-end">End Time</label>
              <input type="time" id="edit-end" value="${reservation.end}" required />
            </div>
          </div>
          
          <div class="edit-buttons">
            <button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set minimum date to today
    const dateInput = modal.querySelector('#edit-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Focus on first input
    setTimeout(() => {
      modal.querySelector('#edit-court').focus();
    }, 100);
    
    // Handle form submission
    const form = modal.querySelector('#edit-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const courtId = modal.querySelector('#edit-court').value;
      const date = modal.querySelector('#edit-date').value;
      const start = modal.querySelector('#edit-start').value;
      const end = modal.querySelector('#edit-end').value;
      
      // Validate times
      if (start >= end) {
        showModalError(modal, 'Start time must be before end time.');
        return;
      }
      
      // Disable submit button while processing
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      
      try {
        console.log('Updating reservation:', reservationId, { courtId, date, start, end });
        
        // Update reservation
        await patch(`/api/v1/reservations/${reservationId}`, {
          courtId,
          date,
          start,
          end
        });
        
        console.log('Reservation updated successfully');
        
        // Close modal
        document.body.removeChild(modal);
        
        // Reload reservations
        console.log('Reloading reservations...');
        if (window.loadUserReservations) {
          console.log('Calling window.loadUserReservations()');
          await window.loadUserReservations();
          console.log('Reservations reloaded');
        } else {
          console.log('window.loadUserReservations not found, reloading page');
          window.location.reload();
        }
        
        // Show success message
        const main = document.querySelector('main');
        if (main) {
          const successMsg = document.createElement('div');
          successMsg.className = 'success';
          successMsg.innerHTML = '<strong>Success:</strong> Reservation updated successfully!';
          main.insertBefore(successMsg, main.firstChild);
          setTimeout(() => successMsg.remove(), 3000);
        }
      } catch (error) {
        console.error('Failed to update reservation:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Extract error message from API response
        let errorMsg = 'Failed to update reservation. Please try again.';
        if (error.message) {
          try {
            // Try to parse JSON error response
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.error || error.message;
          } catch {
            // If not JSON, check if it contains "overlaps" or "booked"
            if (error.message.includes('overlaps') || error.message.includes('booked') || error.message.includes('409')) {
              errorMsg = 'This time slot is already booked. Please choose a different time.';
            } else {
              errorMsg = error.message;
            }
          }
        }
        
        console.log('Showing error:', errorMsg);
        showModalError(modal, errorMsg);
      }
    });
    
    // Close handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };
    
    modal.querySelector('#close-modal').addEventListener('click', closeModal);
    modal.querySelector('#cancel-edit').addEventListener('click', closeModal);
    modal.querySelector('.edit-overlay').addEventListener('click', closeModal);
    
    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
  } catch (error) {
    console.error('Failed to load reservation:', error);
    alert('Failed to load reservation details. Please try again.');
  }
}

function showModalError(modal, message) {
  const form = modal.querySelector('#edit-form');
  if (!form) return;
  
  let errorDiv = form.querySelector('.form-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    const buttons = form.querySelector('.edit-buttons');
    if (buttons) {
      form.insertBefore(errorDiv, buttons);
    }
  }
  
  errorDiv.textContent = message;
  setTimeout(() => {
    if (errorDiv && errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Add styles for the edit modal
const style = document.createElement('style');
style.textContent = `
  .edit-modal {
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
  
  .edit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  }
  
  .edit-dialog {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
    z-index: 1;
  }
  
  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .edit-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e293b;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
  
  #edit-form {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    font-family: inherit;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .edit-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .edit-buttons .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }
  
  .edit-buttons .btn-secondary {
    background: #e2e8f0;
    color: #475569;
  }
  
  .edit-buttons .btn-secondary:hover {
    background: #cbd5e1;
  }
  
  .edit-buttons .btn-primary {
    background: #2563eb;
    color: white;
  }
  
  .edit-buttons .btn-primary:hover {
    background: #1d4ed8;
  }
  
  .edit-buttons .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .form-error {
    background: #fee2e2;
    color: #991b1b;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: 2px solid #f87171;
    animation: shake 0.4s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
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
  
  @media (max-width: 640px) {
    .edit-dialog {
      width: 95%;
      max-height: 95vh;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

