import express from 'express';
import * as usersRepo from '../repositories/usersRepo.js';
import { validateRequired, validateEmail, validateStringLength } from '../middleware/validate.js';

const router = express.Router();

// GET /api/v1/users/me (mock endpoint for demo)
router.get('/me', async (req, res, next) => {
  try {
    const user = await usersRepo.getDemoUser();
    res.json(user);
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

// POST /api/v1/users
router.post('/',
  validateRequired(['email', 'name', 'skill']),
  validateEmail('email'),
  validateStringLength('name', 100),
  validateStringLength('skill', 20),
  async (req, res, next) => {
    try {
      const { email, name, skill } = req.body;
      
      // Check if user already exists
      const existingUser = await usersRepo.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      const result = await usersRepo.create({ email, name, skill });
      res.status(201).json({ _id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }
);

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
