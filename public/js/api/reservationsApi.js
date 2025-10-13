// Reservations API functions

import { get, post, patch, del } from './http.js';

const API_BASE = '/api/v1/reservations';

export async function getReservations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.courtId) params.append('courtId', filters.courtId);
  if (filters.date) params.append('date', filters.date);
  if (filters.userId) params.append('userId', filters.userId);
  
  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  return get(url);
}

export async function getReservation(id) {
  return get(`${API_BASE}/${id}`);
}

export async function createReservation(reservationData) {
  return post(API_BASE, reservationData);
}

export async function updateReservation(id, updateData) {
  return patch(`${API_BASE}/${id}`, updateData);
}

export async function deleteReservation(id) {
  return del(`${API_BASE}/${id}`);
}

export async function getUserReservations() {
  // Get current user's ID from localStorage
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return [];
  }
  return getReservations({ userId });
}
