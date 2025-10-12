// Main application router and initialization

import { initHome } from './pages/home.js';
import { initReservations } from './pages/reservations.js';
import { initBuddies } from './pages/buddies.js';
import { updateNavigation } from './utils/auth.js';
import './utils/confirmModal.js'; // Load custom confirm modal
import './utils/reservationActions.js'; // Load reservation actions globally
import './utils/buddyActions.js'; // Load buddy actions globally

// Router function to initialize the correct page
function initPage() {
  const path = window.location.pathname;
  
  // Initialize navigation for all pages
  updateNavigation();
  
  try {
    switch (path) {
      case '/':
      case '/index.html':
        initHome();
        break;
      case '/reservations.html':
        initReservations();
        break;
      case '/buddies.html':
        initBuddies();
        break;
      default:
        // For any other path, try to initialize home page
        initHome();
    }
  } catch (error) {
    showPageError('Failed to load page. Please refresh and try again.');
  }
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', () => {
  showPageError('An unexpected error occurred. Please refresh and try again.');
});

// Global error handler for JavaScript errors
window.addEventListener('error', () => {
  showPageError('A JavaScript error occurred. Please refresh and try again.');
});

function showPageError(message) {
  const main = document.querySelector('main');
  if (main) {
    const existingError = main.querySelector('.error');
    if (existingError) existingError.remove();
    
    main.insertAdjacentHTML('afterbegin', `
      <div class="error">
        <strong>Error:</strong> ${message}
        <button onclick="location.reload()" style="margin-left: 1rem; padding: 0.25rem 0.5rem; font-size: 0.875rem;">Refresh Page</button>
      </div>
    `);
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Also initialize if DOM is already loaded (for dynamic navigation)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
