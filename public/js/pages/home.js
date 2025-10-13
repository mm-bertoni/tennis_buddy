// Home page functionality

import { getCourts } from '../api/courtsApi.js';
import { getReservations } from '../api/reservationsApi.js';
import { createBuddyPost } from '../api/buddiesApi.js';
import { renderCourtsSelect, renderReservationCards, showError, showSuccess } from '../views/renderCards.js';
import { isLoggedIn } from '../utils/auth.js';

let courts = [];

export async function initHome() {
  try {
    updateUIBasedOnAuth();
    await loadCourts();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to initialize home page:', error);
    showError('Failed to load page data. Please refresh and try again.');
  }
}

function updateUIBasedOnAuth() {
  const buddyBoardSection = document.getElementById('buddy-board');
  
  if (!isLoggedIn() && buddyBoardSection) {
    buddyBoardSection.style.display = 'none';
  } else if (buddyBoardSection) {
    buddyBoardSection.style.display = '';
  }
}

async function loadCourts() {
  try {
    courts = await getCourts();
    const courtSelect = document.querySelector('#court');
    if (courtSelect) {
      renderCourtsSelect(courts, courtSelect);
    }
  } catch (error) {
    console.error('Failed to load courts:', error);
    showError('Failed to load courts. Please refresh and try again.');
  }
}


function setupEventListeners() {
  const searchForm = document.querySelector('#search-form');
  const postForm = document.querySelector('#post-form');

  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchReservations);
  }

  if (postForm) {
    postForm.addEventListener('submit', handlePostBuddy);
  }
}

async function handleSearchReservations(event) {
  event.preventDefault();
  
  // Get values directly from form elements by ID
  const dateInput = document.querySelector('#date');
  const courtSelect = document.querySelector('#court');
  
  const date = dateInput.value;
  const courtId = courtSelect.value;
  
  
  if (!date || !courtId) {
    showError('Please select both date and court.');
    return;
  }

  const resultsContainer = document.querySelector('#results');
  if (resultsContainer) {
    resultsContainer.innerHTML = '<p class="loading">Searching for reservations...</p>';
  }

  try {
    const reservations = await getReservations({ date, courtId });
    
    // Find the court name for display
    const court = courts.find(c => c._id === courtId);
    const courtName = court ? court.name : 'Unknown Court';
    
    if (resultsContainer) {
      if (reservations.length === 0) {
        resultsContainer.innerHTML = `
          <div class="no-results">
            <h4>Court Available!</h4>
            <p>No reservations found for ${courtName} on ${formatDate(date)}.</p>
            <p><a href="/reservations.html" class="btn btn-primary">Book This Court</a></p>
          </div>
        `;
      } else {
        renderReservationCards(reservations, resultsContainer);
        resultsContainer.insertAdjacentHTML('afterbegin', 
          `<h4>Reservations for ${courtName} on ${formatDate(date)}</h4>`
        );
      }
    }
  } catch (error) {
    console.error('Failed to search reservations:', error);
    showError('Failed to search reservations. Please try again.');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }
}

async function handlePostBuddy(event) {
  event.preventDefault();
  
  // Get values directly from form elements by ID
  const skillInput = document.querySelector('#skill');
  const availabilityInput = document.querySelector('#availability');
  const notesInput = document.querySelector('#notes');
  
  const skill = skillInput.value;
  const availability = availabilityInput.value;
  const notes = notesInput.value;


  if (!skill || !availability) {
    showError('Please fill in skill level and availability.');
    return;
  }

  try {
    await createBuddyPost({
      skill,
      availability,
      notes: notes || ''
    });
    
    showSuccess('Your buddy post has been added to the board! <a href="/buddies.html" style="color: inherit; text-decoration: underline;">View all posts</a>');
    event.target.reset();
  } catch (error) {
    console.error('Failed to create buddy post:', error);
    showError('Failed to post to buddy board. Please try again.');
  }
}


function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
