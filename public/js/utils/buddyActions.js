// Global functions for buddy post actions

import { closeBuddyPost as closePost, deleteBuddyPost as deletePost } from '../api/buddiesApi.js';
import { showConfirm } from './confirmModal.js';

export async function closeBuddyPost(postId) {
  showConfirm(
    'Are you sure you want to close this post?',
    async () => {
      try {
        await closePost(postId);
        // Reload posts
        if (window.loadMyPosts) {
          await window.loadMyPosts();
        }
        if (window.loadAllPosts) {
          await window.loadAllPosts();
        }
      } catch (error) {
        console.error('Failed to close post:', error);
        const main = document.querySelector('main');
        if (main) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error';
          errorMsg.innerHTML = '<strong>Error:</strong> Failed to close post. Please try again.';
          main.insertBefore(errorMsg, main.firstChild);
          setTimeout(() => errorMsg.remove(), 3000);
        }
      }
    }
  );
}

export async function deleteBuddyPost(postId) {
  showConfirm(
    'Are you sure you want to delete this post? This action cannot be undone.',
    async () => {
      try {
        await deletePost(postId);
        // Reload posts
        if (window.loadMyPosts) {
          await window.loadMyPosts();
        }
        if (window.loadAllPosts) {
          await window.loadAllPosts();
        }
        
        // Show success message
        const main = document.querySelector('main');
        if (main) {
          const successMsg = document.createElement('div');
          successMsg.className = 'success';
          successMsg.innerHTML = '<strong>Success:</strong> Post deleted successfully!';
          main.insertBefore(successMsg, main.firstChild);
          setTimeout(() => successMsg.remove(), 3000);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        const main = document.querySelector('main');
        if (main) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error';
          errorMsg.innerHTML = '<strong>Error:</strong> Failed to delete post. Please try again.';
          main.insertBefore(errorMsg, main.firstChild);
          setTimeout(() => errorMsg.remove(), 3000);
        }
      }
    }
  );
}

export async function editBuddyPost(postId) {
  console.log('editBuddyPost called for:', postId);
  try {
    const { showEditBuddyModal } = await import('./editBuddyModal.js');
    console.log('Modal module loaded, showing modal...');
    await showEditBuddyModal(postId);
  } catch (error) {
    console.error('Failed to open edit modal:', error);
    alert('Failed to open edit dialog. Please try again.');
  }
}

// Make functions available globally
window.closeBuddyPost = closeBuddyPost;
window.deleteBuddyPost = deleteBuddyPost;
window.editBuddyPost = editBuddyPost;

