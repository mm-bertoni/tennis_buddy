// Authentication utility functions

export function isLoggedIn() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
}

export function getCurrentUserId() {
  return localStorage.getItem('userId');
}

export function getCurrentUserName() {
  // Try to get from localStorage if we stored it during login
  return localStorage.getItem('userName') || 'User';
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  window.location.href = '/';
}

export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
  }
}

let navigationInitialized = false;

export function updateNavigation() {
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  if (!profileBtn || !profileDropdown) return;
  
  // Update dropdown content based on auth state
  if (isLoggedIn()) {
    profileDropdown.innerHTML = `
      <div class="user-info">
        <div class="user-name">${getCurrentUserName()}</div>
      </div>
      <a href="/reservations.html" class="dropdown-item">
        <span class="icon">📅</span>
        <span>My Reservations</span>
      </a>
      <a href="/buddies.html" class="dropdown-item">
        <span class="icon">🎾</span>
        <span>My Posts</span>
      </a>
      <a href="#" class="dropdown-item" id="logout-btn">
        <span class="icon">🚪</span>
        <span>Log Out</span>
      </a>
    `;
    
    // Add logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    profileDropdown.innerHTML = `
      <a href="/login.html" class="dropdown-item">
        <span class="icon">🔑</span>
        <span>Log In</span>
      </a>
      <a href="/signup.html" class="dropdown-item">
        <span class="icon">✨</span>
        <span>Sign Up</span>
      </a>
    `;
  }
  
  // Only add event listeners once
  if (!navigationInitialized) {
    // Toggle dropdown on button click
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
        profileDropdown.classList.remove('show');
      }
    });
    
    // Close dropdown when clicking a link
    profileDropdown.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropdown-item') || e.target.closest('.dropdown-item')) {
        profileDropdown.classList.remove('show');
      }
    });
    
    navigationInitialized = true;
  }
}

