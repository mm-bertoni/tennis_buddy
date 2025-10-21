# Authentication-Based Visibility Implementation

## Overview
This document describes the authentication-based visibility system implemented for the Tennis Buddy application.

## Core Logic

### 1. **Not Logged In** 
- ❌ No personal records shown (posts/reservations)
- ✅ Can view all public content (global posts via filters)
- ❌ Cannot create posts or reservations

### 2. **Logged In**
- ✅ "My Posts" section shows only YOUR posts with edit/delete buttons
- ✅ "My Reservations" page shows only YOUR reservations
- ✅ Can create new posts and reservations
- ✅ "All Posts" section shows EVERYONE'S posts (read-only, filtered by skill)

---

## Files Created

### `/public/js/utils/auth.js`
**Purpose:** Authentication utility functions
- `isLoggedIn()` - Check if user has valid token
- `getCurrentUserId()` - Get logged-in user's ID
- `logout()` - Clear session and redirect to login
- `updateNavigation()` - Update nav links based on auth state

### `/public/js/utils/buddyActions.js`
**Purpose:** Global action handlers for buddy posts
- `closeBuddyPost(postId)` - Close/reopen a post
- `deleteBuddyPost(postId)` - Delete a post
- Both reload "My Posts" and "All Posts" after action

---

## Files Modified

### Backend Changes

#### `/src/routes/auth.js`
- ✅ Added `export default router;` (was missing)

#### `/src/repositories/usersRepo.js`
- ✅ Changed `doc.password` to `doc.passwordHash` for consistency with auth route

#### `/src/routes/buddies.js`
- ✅ Added support for `userId` query parameter
- Now supports: `/api/v1/buddies?userId=xxx` to get user-specific posts

#### `/src/repositories/buddiesRepo.js`
- ✅ Enhanced `findAll()` to use MongoDB aggregation
- Now populates `userName` field from users collection
- Posts in "All Posts" now show who posted them

### Frontend Changes

#### `/public/index.html`, `/public/reservations.html`, `/public/buddies.html`
- ✅ Added "Log In" and "Sign Up" links to navigation
- ✅ Navigation updates dynamically based on auth state

#### `/public/buddies.html`
- ✅ Split into 3 sections:
  1. **"📝 Post Your Availability"** - Form (hidden when not logged in)
  2. **"📌 My Posts"** - User's own posts with edit buttons (hidden when not logged in)
  3. **"👥 Available Hitting Partners"** - All users' posts (always visible, filtered by skill)

#### `/public/js/pages/buddies.js`
- ✅ Added `updateUIBasedOnAuth()` - Show/hide sections based on login
- ✅ Added `loadMyPosts()` - Load user's own posts
- ✅ Renamed `loadBuddyPosts()` to `loadAllPosts()` - Load all users' posts
- ✅ Separate containers: `#my-posts` and `#all-posts`
- ✅ Integrated auth utility and buddy actions

#### `/public/js/pages/home.js`
- ✅ Added `updateUIBasedOnAuth()` - Hide buddy board form when not logged in
- ✅ Integrated auth utility

#### `/public/js/pages/reservations.js`
- ✅ Added login requirement check
- ✅ Shows "Login Required" message with login/signup buttons if not authenticated
- ✅ Integrated auth utility

#### `/public/js/api/buddiesApi.js`
- ✅ Added `getMyBuddyPosts()` - Fetch posts for current user only

#### `/public/js/views/renderCards.js`
- ✅ Updated `renderBuddyPosts()` to accept `showEditButtons` parameter
- ✅ Displays user name (👤) for all posts
- ✅ Shows Close/Delete buttons only for "My Posts"

---

## User Experience Flow

### Scenario 1: Not Logged In User
1. Visits home page → Sees court search, **no buddy board form**
2. Clicks "Buddy Board" → Sees only "All Posts" and filter, **no post form or "My Posts"**
3. Clicks "Reservations" → Sees "Login Required" message with login/signup buttons
4. Can filter all posts by skill level

### Scenario 2: Logged In User
1. Visits home page → Sees court search **and buddy board form**
2. Clicks "Buddy Board" → Sees:
   - **Post form** to create new posts
   - **"My Posts"** section with edit/delete buttons for own posts
   - **"All Posts"** section with everyone's posts (filtered, read-only)
3. Clicks "Reservations" → Sees booking form and own reservations
4. Can create, edit, and delete own posts
5. Can book, edit, and cancel own reservations
6. Navigation shows "Log Out" instead of "Log In"/"Sign Up"

---

## API Endpoints Used

### Public (No Auth Required)
- `GET /api/v1/buddies` - Get all posts (optionally filtered by skill or userId)
- `GET /api/v1/courts` - Get all courts
- `GET /api/v1/reservations?date=X&courtId=Y` - Get reservations by date/court

### Protected (Auth Required)
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/buddies` - Create buddy post
- `PATCH /api/v1/buddies/:id/close` - Close/reopen post
- `DELETE /api/v1/buddies/:id` - Delete post
- `POST /api/v1/reservations` - Create reservation
- `DELETE /api/v1/reservations/:id` - Cancel reservation

---

## Testing the Implementation

### Test Not Logged In State
1. Clear localStorage in browser DevTools: `localStorage.clear()`
2. Refresh page
3. Verify: No post form, no "My Posts" section visible
4. Verify: Reservations page shows login message
5. Verify: Can still see and filter all global posts

### Test Logged In State
1. Sign up or log in
2. Verify: Navigation changes to show "Log Out"
3. Go to Buddy Board
4. Verify: Post form is visible
5. Create a post
6. Verify: Post appears in "My Posts" with edit buttons
7. Verify: Post also appears in "All Posts" with your name
8. Verify: Can filter "All Posts" by skill level
9. Verify: Other users' posts in "All Posts" have no edit buttons

### Test Reservations
1. While logged in, go to Reservations page
2. Verify: Booking form is visible
3. Book a court
4. Verify: Reservation appears in "My Reservations"
5. Log out
6. Go to Reservations page
7. Verify: Shows "Login Required" message

---

## Security Notes

- JWT tokens stored in localStorage
- Protected routes use `requireAuth` middleware on backend
- Frontend checks are for UX only - backend enforces all permissions
- Users can only edit/delete their own posts and reservations (verified by backend)
- User ID comes from JWT token (not from request body) on backend

---

## Summary

✅ Authentication-based visibility fully implemented
✅ Separate "My Posts" (editable) and "All Posts" (filtered, read-only) sections
✅ Login required for personal content
✅ Public content (filtered posts) always visible
✅ Navigation updates dynamically based on auth state
✅ User names displayed on all posts
✅ Full CRUD operations for own content only

// I Liked how you broke out the Authentication in detail and described what was available publicly vs. for authenticated users. 

