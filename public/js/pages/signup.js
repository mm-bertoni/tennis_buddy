// Signup page functionality

import { post } from '..http.js';

const form = document.querySelector('#signup-form');
const messageBox = document.querySelector('#message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get input values
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const skill = document.querySelector('#skill').value;

  // Front-end validation
  if (!name || !email || !skill) {
    showMessage('Please fill out all fields.', 'error');
    return;
  }

  try {
    // Send data to backend API
    const response = await post('/api/v1/users', { name, email, skill });

    showMessage('Account created successfully!', 'success');

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
  } catch (err) {
    showMessage(`Failed to sign up: ${err.message}`, 'error');
  }
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
}
