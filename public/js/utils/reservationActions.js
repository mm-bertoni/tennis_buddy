// Global functions for reservation actions

import { del } from '../api/http.js';
import { showConfirm } from './confirmModal.js';

async function cancelReservation(reservationId) {
  showConfirm(
    'Are you sure you want to cancel this reservation?',
    async () => {
      try {
        // Call DELETE API directly
        await del(`/api/v1/reservations/${reservationId}`);
        
        // Reload reservations if the function exists
        if (window.loadUserReservations) {
          await window.loadUserReservations();
        } else {
          // Fallback: reload the page
          window.location.reload();
        }
        
        // Show success message
        const main = document.querySelector('main');
        if (main) {
          const successMsg = document.createElement('div');
          successMsg.className = 'success';
          successMsg.innerHTML = '<strong>Success:</strong> Reservation cancelled successfully!';
          main.insertBefore(successMsg, main.firstChild);
          setTimeout(() => successMsg.remove(), 3000);
        }
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
        
        // Show error message
        const main = document.querySelector('main');
        if (main) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error';
          errorMsg.innerHTML = '<strong>Error:</strong> Failed to cancel reservation. Please try again.';
          main.insertBefore(errorMsg, main.firstChild);
          setTimeout(() => errorMsg.remove(), 3000);
        }
      }
    }
  );
}

async function editReservation(reservationId) {
  const { showEditReservationModal } = await import('./editReservationModal.js');
  await showEditReservationModal(reservationId);
}

// Make functions available globally immediately
window.cancelReservation = cancelReservation;
window.editReservation = editReservation;

console.log('Reservation actions loaded:', typeof window.cancelReservation, typeof window.editReservation);

