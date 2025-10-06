// Buddies page functionality

import { createBuddyPost, getBuddyPosts } from '../api/buddiesApi.js';
import { renderBuddyPosts, showError, showSuccess } from '../views/renderCards.js';

export async function initBuddies() {
  try {
    await loadBuddyPosts();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to initialize buddies page:', error);
    showError('Failed to load page data. Please refresh and try again.');
  }
}

async function loadBuddyPosts(filters = {}) {
  try {
    const posts = await getBuddyPosts(filters);
    const postsContainer = document.querySelector('#posts');
    if (postsContainer) {
      if (filters.skill && posts.length > 0) {
        postsContainer.insertAdjacentHTML('afterbegin', 
          `<div class="filter-results"><p>Showing ${posts.length} post(s) for skill level: ${filters.skill}</p></div>`
        );
      }
      renderBuddyPosts(posts, postsContainer);
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
    await loadBuddyPosts(); // Refresh the posts
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
  
  await loadBuddyPosts(filters);
}
