// DOM rendering helpers

export function renderCourtsSelect(courts, selectElement) {
  selectElement.innerHTML = '<option value="">Select a court</option>' +
    courts.map(court => 
      `<option value="${court._id}">${court.name} - ${court.location}</option>`
    ).join('');
}

export function renderReservationCards(reservations, container) {
  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h4>No reservations found</h4>
        <p>No reservations exist for the selected date and court.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reservations.map(reservation => `
    <div class="result-card booked">
      <div>
        <div class="time-slot">${formatTime(reservation.start)} - ${formatTime(reservation.end)}</div>
        <div class="court-info">Status: ${reservation.status}</div>
      </div>
      <div class="status booked">Booked</div>
    </div>
  `).join('');
}

export function renderBuddyPosts(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <h4>No buddy posts found</h4>
        <p>No hitting partners are currently available. Be the first to post!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <span class="post-skill">${post.skill}</span>
        <span class="post-status ${post.isOpen ? 'open' : 'closed'}">
          ${post.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      <div class="post-availability">${post.availability}</div>
      ${post.notes ? `<div class="post-notes">${post.notes}</div>` : ''}
      <div class="post-meta">
        <span class="post-date">Posted ${formatDate(post.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

export function renderUserReservations(reservations, container, courts = []) {
  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h4>No reservations</h4>
        <p>You don't have any court reservations yet. Book a court above!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reservations.map(reservation => {
    // Find the court name by ID
    const court = courts.find(c => c._id === reservation.courtId);
    const courtName = court ? court.name : `Court ${reservation.courtId}`;
    
    return `
      <div class="reservation-card">
        <div class="reservation-info">
          <div class="reservation-court">${courtName}</div>
          <div class="reservation-details">
            <div class="reservation-date">${formatDate(reservation.date)}</div>
            <div class="reservation-time">${formatTime(reservation.start)} - ${formatTime(reservation.end)}</div>
            <div class="reservation-status">Status: <span class="status ${reservation.status}">${reservation.status}</span></div>
          </div>
        </div>
        <div class="reservation-actions">
          <button class="btn btn-secondary" onclick="editReservation('${reservation._id}')">Edit</button>
          <button class="btn btn-danger" onclick="cancelReservation('${reservation._id}')">Cancel</button>
        </div>
      </div>
    `;
  }).join('');
}

export function showError(message, container = null) {
  const errorHtml = `
    <div class="error">
      <strong>Error:</strong> ${message}
    </div>
  `;
  
  if (container) {
    container.innerHTML = errorHtml;
  } else {
    // Show at top of page
    const main = document.querySelector('main');
    const existingError = main.querySelector('.error');
    if (existingError) existingError.remove();
    
    main.insertAdjacentHTML('afterbegin', errorHtml);
    setTimeout(() => {
      const error = main.querySelector('.error');
      if (error) error.remove();
    }, 5000);
  }
}

export function showSuccess(message, container = null) {
  const successHtml = `
    <div class="success">
      <strong>Success:</strong> ${message}
    </div>
  `;
  
  if (container) {
    container.innerHTML = successHtml;
  } else {
    // Show at top of page
    const main = document.querySelector('main');
    const existingSuccess = main.querySelector('.success');
    if (existingSuccess) existingSuccess.remove();
    
    main.insertAdjacentHTML('afterbegin', successHtml);
    setTimeout(() => {
      const success = main.querySelector('.success');
      if (success) success.remove();
    }, 5000);
  }
}

// Utility functions
export function formatTime(time) {
  return time.slice(0, 5); // Remove seconds if present
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Global functions for inline event handlers
window.editReservation = async function(_id) {
  // TODO: Implement edit functionality
  alert('Edit functionality coming soon!');
};

window.cancelReservation = async function(id) {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    try {
      const { deleteReservation } = await import('./api/reservationsApi.js');
      await deleteReservation(id);
      showSuccess('Reservation cancelled successfully');
      // Reload reservations
      if (window.loadUserReservations) {
        window.loadUserReservations();
      }
    } catch (error) {
      showError('Failed to cancel reservation: ' + error.message);
    }
  }
};
