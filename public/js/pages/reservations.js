// Reservations page functionality

import { getCourts } from '../api/courtsApi.js';
import { createReservation, getUserReservations } from '../api/reservationsApi.js';
import { renderCourtsSelect, renderUserReservations, showError, showSuccess } from '../views/renderCards.js';

let courts = [];

export async function initReservations() {
  try {
    await loadCourts();
    await loadUserReservations();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to initialize reservations page:', error);
    showError('Failed to load page data. Please refresh and try again.');
  }
}

async function loadCourts() {
  try {
    courts = await getCourts();
    const courtSelect = document.querySelector('#booking-court');
    if (courtSelect) {
      renderCourtsSelect(courts, courtSelect);
    }
  } catch (error) {
    console.error('Failed to load courts:', error);
    showError('Failed to load courts. Please refresh and try again.');
  }
}

export async function loadUserReservations() {
  try {
    const reservations = await getUserReservations();
    const reservationsContainer = document.querySelector('#reservations-list');
    if (reservationsContainer) {
      // Pass the courts data so we can show court names instead of IDs
      renderUserReservations(reservations, reservationsContainer, courts);
    }
  } catch (error) {
    console.error('Failed to load user reservations:', error);
    showError('Failed to load your reservations. Please refresh and try again.');
  }
}

function setupEventListeners() {
  const bookingForm = document.querySelector('#booking-form');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookCourt);
  }
}

async function handleBookCourt(event) {
  event.preventDefault();
  
  // Get values directly from form elements by ID
  const courtSelect = document.querySelector('#booking-court');
  const dateInput = document.querySelector('#booking-date');
  const startInput = document.querySelector('#booking-start');
  const endInput = document.querySelector('#booking-end');
  
  const courtId = courtSelect.value;
  const date = dateInput.value;
  const start = startInput.value;
  const end = endInput.value;
  
  
  if (!courtId || !date || !start || !end) {
    showError('Please fill in all booking fields.');
    return;
  }

  // Validate time logic
  if (start >= end) {
    showError('Start time must be before end time.');
    return;
  }

  // Validate date is not in the past
  const selectedDate = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showError('Cannot book courts for dates in the past.');
    return;
  }

  try {
    await createReservation({
      courtId,
      date,
      start,
      end
    });
    
    // Find the court name for confirmation
    const court = courts.find(c => c._id === courtId);
    const courtName = court ? court.name : 'Unknown Court';
    
    showSuccess(`Successfully booked ${courtName} for ${formatDate(date)} from ${formatTime(start)} to ${formatTime(end)}!`);
    
    // Reset form
    event.target.reset();
    
    // Reload reservations
    await loadUserReservations();
  } catch (error) {
    console.error('Failed to book court:', error);
    
    // Handle specific error messages
    if (error.message.includes('overlaps')) {
      showError('This time slot is already booked. Please choose a different time.');
    } else if (error.message.includes('Invalid')) {
      showError('Invalid booking data. Please check your input.');
    } else {
      showError('Failed to book court. Please try again.');
    }
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

function formatTime(timeString) {
  return timeString.slice(0, 5); // Remove seconds if present
}

// Make loadUserReservations available globally for inline event handlers
window.loadUserReservations = loadUserReservations;
