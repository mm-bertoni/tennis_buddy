// Buddies page functionality

import { createBuddyPost, getBuddyPosts, getMyBuddyPosts } from '../api/buddiesApi.js';
import { renderBuddyPosts, showError, showSuccess } from '../views/renderCards.js';
import { isLoggedIn } from '../utils/auth.js';
import '../utils/buddyActions.js'; // Import buddy action handlers

export async function initBuddies() {
  try {
    updateUIBasedOnAuth();
    await loadAllPosts();
    if (isLoggedIn()) {
      await loadMyPosts();
    }
    setupEventListeners();
  } catch (error) {
    console.error('Failed to initialize buddies page:', error);
    showError('Failed to load page data. Please refresh and try again.');
  }
}

function updateUIBasedOnAuth() {
  const postFormSection = document.getElementById('post-form-section');
  const myPostsSection = document.getElementById('my-posts-section');
  
  if (isLoggedIn()) {
    if (postFormSection) postFormSection.style.display = '';
    if (myPostsSection) myPostsSection.style.display = '';
  } else {
    if (postFormSection) postFormSection.style.display = 'none';
    if (myPostsSection) myPostsSection.style.display = 'none';
  }
}

async function loadMyPosts() {
  try {
    const posts = await getMyBuddyPosts();
    const myPostsContainer = document.querySelector('#my-posts');
    if (myPostsContainer) {
      if (posts.length === 0) {
        myPostsContainer.innerHTML = '<p style="color: #64748b;">You haven\'t posted yet. Use the form above to create your first post!</p>';
      } else {
        renderBuddyPosts(posts, myPostsContainer, true); // true = showEditButtons
      }
    }
  } catch (error) {
    console.error('Failed to load my posts:', error);
    showError('Failed to load your posts. Please refresh and try again.');
  }
}

async function loadAllPosts(filters = {}) {
  try {
    const posts = await getBuddyPosts(filters);
    const allPostsContainer = document.querySelector('#all-posts');
    if (allPostsContainer) {
      let html = '';
      if (filters.skill) {
        html = `<div class="filter-results"><p>Showing ${posts.length} post(s) for skill level: ${filters.skill}</p></div>`;
      }
      allPostsContainer.innerHTML = html;
      if (posts.length === 0) {
        allPostsContainer.innerHTML += '<p style="color: #64748b;">No posts found.</p>';
      } else {
        renderBuddyPosts(posts, allPostsContainer, false); // false = no edit buttons for global posts
      }
    }
  } catch (error) {
    console.error('Failed to load buddy posts:', error);
    showError('Failed to load buddy posts. Please refresh and try again.');
  }
}

function setupEventListeners() {
  const postForm = document.querySelector('#post-form');
  const filterForm = document.querySelector('#filter-form');

  if (postForm) {
    postForm.addEventListener('submit', handlePostBuddy);
  }

  if (filterForm) {
    filterForm.addEventListener('submit', handleFilterPosts);
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
    
    showSuccess('Your buddy post has been added to the board!');
    event.target.reset();
    
    // Refresh both my posts and all posts
    await loadMyPosts();
    await loadAllPosts();
  } catch (error) {
    console.error('Failed to create buddy post:', error);
    showError('Failed to post to buddy board. Please try again.');
  }
}

async function handleFilterPosts(event) {
  event.preventDefault();
  
  const skillFilter = document.querySelector('#skill-filter');
  const skill = skillFilter.value;
  
  const filters = {};
  if (skill) {
    filters.skill = skill;
  }
  
  await loadAllPosts(filters);
}

// Make functions available globally for delete/edit buttons
window.loadMyPosts = loadMyPosts;
window.loadAllPosts = loadAllPosts;
