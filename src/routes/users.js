import express from 'express';
import * as usersRepo from '../repositories/usersRepo.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/users/me - Get current authenticated user
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await usersRepo.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Don't send password hash
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users
router.get('/', async (req, res, next) => {
  try {
    const users = await usersRepo.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await usersRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/users/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await usersRepo.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await usersRepo.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
