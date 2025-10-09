// Signup page functionality

import { post } from '../api/http.js';

const form = document.querySelector('#signup-form');
const messageBox = document.querySelector('#message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get input values
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const skill = document.querySelector('#skill').value;
  const password = document.querySelector('#password').value;

  // Input validation
  if (!name || !email || !skill || !password) {
    showMessage('Please fill out all fields.', 'error');
    return;
  }

  try {
    // Send data to backend API
    const response = await post('/api/v1/auth/signup', { name, email, skill, password });

    // Store token and userId for authenticated requests
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
    }

    showMessage('Account created successfully! Redirecting...', 'success');

    // Redirect after a short while
    setTimeout(() => {
      window.location.href = '/home.html';
    }, 1000);
  } catch (err) {
    showMessage(`Failed to sign up: ${err.message}`, 'error');
  }
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
}
