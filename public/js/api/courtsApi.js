// Courts API functions

import { get, post, patch, del } from './http.js';

const API_BASE = '/api/v1/courts';

export async function getCourts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.surface) params.append('surface', filters.surface);
  if (filters.location) params.append('location', filters.location);
  
  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  return get(url);
}

export async function getCourt(id) {
  return get(`${API_BASE}/${id}`);
}

export async function createCourt(courtData) {
  return post(API_BASE, courtData);
}

export async function updateCourt(id, updateData) {
  return patch(`${API_BASE}/${id}`, updateData);
}

export async function deleteCourt(id) {
  return del(`${API_BASE}/${id}`);
}
