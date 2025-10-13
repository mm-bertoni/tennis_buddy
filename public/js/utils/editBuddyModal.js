// Edit buddy post modal

import { patch } from '../api/http.js';
import { getBuddyPost } from '../api/buddiesApi.js';

export async function showEditBuddyModal(postId) {
  console.log('showEditBuddyModal called for:', postId);
  try {
    // Fetch post details
    console.log('Fetching post details...');
    const post = await getBuddyPost(postId);
    console.log('Post details:', post);
    
    // Create modal
    console.log('Creating modal element...');
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-overlay"></div>
      <div class="edit-dialog">
        <div class="edit-header">
          <h3>Edit Buddy Post</h3>
          <button class="close-btn" id="close-modal">&times;</button>
        </div>
        <form id="edit-buddy-form">
          <div class="form-group">
            <label for="edit-skill">Skill Level</label>
            <select id="edit-skill" required>
              <option value="">Select skill level</option>
              <option value="1.0-2.0" ${post.skill === '1.0-2.0' ? 'selected' : ''}>🎾 1.0-2.0 (Beginner)</option>
              <option value="2.5-3.0" ${post.skill === '2.5-3.0' ? 'selected' : ''}>🎾 2.5-3.0 (Intermediate)</option>
              <option value="3.5-4.0" ${post.skill === '3.5-4.0' ? 'selected' : ''}>🎾 3.5-4.0 (Advanced)</option>
              <option value="4.5-5.0" ${post.skill === '4.5-5.0' ? 'selected' : ''}>🎾 4.5-5.0 (Expert)</option>
              <option value="5.5+" ${post.skill === '5.5+' ? 'selected' : ''}>🎾 5.5+ (Professional)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="edit-availability">Availability</label>
            <input 
              type="text" 
              id="edit-availability" 
              value="${post.availability || ''}" 
              required 
              placeholder="e.g., Weeknights 6-8pm, Weekends"
              maxlength="100"
            />
          </div>
          
          <div class="form-group">
            <label for="edit-notes">Notes (optional)</label>
            <textarea 
              id="edit-notes" 
              rows="4"
              placeholder="e.g., Looking for singles matches, down for drills, prefer outdoor courts"
              maxlength="500"
            >${post.notes || ''}</textarea>
          </div>
          
          <div class="edit-buttons">
            <button type="button" class="btn btn-secondary" id="cancel-edit">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    
    console.log('Appending modal to body...');
    document.body.appendChild(modal);
    console.log('Modal appended! It should be visible now.');
    
    // Focus on first input
    setTimeout(() => {
      modal.querySelector('#edit-skill').focus();
    }, 100);
    
    // Handle form submission
    const form = modal.querySelector('#edit-buddy-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const skill = modal.querySelector('#edit-skill').value;
      const availability = modal.querySelector('#edit-availability').value.trim();
      const notes = modal.querySelector('#edit-notes').value.trim();
      
      // Validate
      if (!skill || !availability) {
        showModalError(modal, 'Please fill in skill level and availability.');
        return;
      }
      
      // Disable submit button while processing
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      
      try {
        console.log('Updating buddy post:', postId, { skill, availability, notes });
        
        // Update post
        await patch(`/api/v1/buddies/${postId}`, {
          skill,
          availability,
          notes
        });
        
        console.log('Buddy post updated successfully');
        
        // Close modal
        document.body.removeChild(modal);
        
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
          successMsg.innerHTML = '<strong>Success:</strong> Post updated successfully!';
          main.insertBefore(successMsg, main.firstChild);
          setTimeout(() => successMsg.remove(), 3000);
        }
      } catch (error) {
        console.error('Failed to update buddy post:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Extract error message
        let errorMsg = 'Failed to update post. Please try again.';
        if (error.message) {
          try {
            const parsed = JSON.parse(error.message);
            errorMsg = parsed.error || error.message;
          } catch {
            errorMsg = error.message;
          }
        }
        
        showModalError(modal, errorMsg);
      }
    });
    
    // Close handlers
    const closeModal = () => {
      document.body.removeChild(modal);
    };
    
    modal.querySelector('#close-modal').addEventListener('click', closeModal);
    modal.querySelector('#cancel-edit').addEventListener('click', closeModal);
    modal.querySelector('.edit-overlay').addEventListener('click', closeModal);
    
    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
  } catch (error) {
    console.error('Failed to load buddy post:', error);
    alert('Failed to load post details. Please try again.');
  }
}

function showModalError(modal, message) {
  const form = modal.querySelector('#edit-buddy-form');
  if (!form) return;
  
  let errorDiv = form.querySelector('.form-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    const buttons = form.querySelector('.edit-buttons');
    if (buttons) {
      form.insertBefore(errorDiv, buttons);
    }
  }
  
  errorDiv.textContent = message;
  setTimeout(() => {
    if (errorDiv && errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Add complete modal styles (same as editReservationModal.js)
const style = document.createElement('style');
style.textContent = `
  .edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .edit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  }
  
  .edit-dialog {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
    z-index: 1;
  }
  
  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .edit-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e293b;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #64748b;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
  
  #edit-buddy-form {
    padding: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    font-family: inherit;
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .edit-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .edit-buttons .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
  }
  
  .edit-buttons .btn-secondary {
    background: #e2e8f0;
    color: #475569;
  }
  
  .edit-buttons .btn-secondary:hover {
    background: #cbd5e1;
  }
  
  .edit-buttons .btn-primary {
    background: #2563eb;
    color: white;
  }
  
  .edit-buttons .btn-primary:hover {
    background: #1d4ed8;
  }
  
  .edit-buttons .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .form-error {
    background: #fee2e2;
    color: #991b1b;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    border: 2px solid #f87171;
    animation: shake 0.4s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 640px) {
    .edit-dialog {
      width: 95%;
      max-height: 95vh;
    }
  }
`;
document.head.appendChild(style);

