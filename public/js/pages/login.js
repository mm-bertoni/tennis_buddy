// Login page functionality

import { post } from '../api/http.js';

const form = document.querySelector('#login-form');
const messageBox = document.querySelector('#message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    if (!email || !password) {
      showMessage('Please enter your email and password.', 'error');
      return;
    }

    try {
      const response = await post('/api/v1/auth/login', { email, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
      }

      showMessage('Logging in...', 'success');
      setTimeout(() => {
        window.location.href = '/home.html';
      }, 800);
    } catch (err) {
      showMessage(`Login failed: ${err.message}`, 'error');
    }
  });
}

function showMessage(text, type) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = type;
}
