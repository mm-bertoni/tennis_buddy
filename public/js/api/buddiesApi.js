// Buddies API functions

import { get, post, patch, del } from './http.js';

const API_BASE = '/api/v1/buddies';

export async function getBuddyPosts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.skill) params.append('skill', filters.skill);
  
  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  return get(url);
}

export async function getBuddyPost(id) {
  return get(`${API_BASE}/${id}`);
}

export async function createBuddyPost(postData) {
  return post(API_BASE, postData);
}

export async function updateBuddyPost(id, updateData) {
  return patch(`${API_BASE}/${id}`, updateData);
}

export async function closeBuddyPost(id) {
  return patch(`${API_BASE}/${id}/close`, {});
}

export async function deleteBuddyPost(id) {
  return del(`${API_BASE}/${id}`);
}
