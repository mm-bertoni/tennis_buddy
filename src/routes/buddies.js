import express from 'express';
import * as buddiesRepo from '../repositories/buddiesRepo.js';
import * as usersRepo from '../repositories/usersRepo.js';
import { validateRequired, validateStringLength } from '../middleware/validate.js';

const router = express.Router();

// GET /api/v1/buddies
router.get('/', async (req, res, next) => {
  try {
    const { skill } = req.query;
    const posts = await buddiesRepo.findAll({ skill });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/buddies/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await buddiesRepo.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/buddies
router.post('/',
  validateRequired(['skill', 'availability']),
  validateStringLength('skill', 50),
  validateStringLength('availability', 100),
  validateStringLength('notes', 500),
  async (req, res, next) => {
    try {
      const { skill, availability, notes } = req.body;
      
      // Get demo user for class demonstration
      const user = await usersRepo.getDemoUser();
      
      const result = await buddiesRepo.create({
        userId: user._id,
        skill,
        availability,
        notes
      });
      
      res.status(201).json({ _id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/buddies/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await buddiesRepo.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    res.json({ message: 'Buddy post updated successfully' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/buddies/:id/close
router.patch('/:id/close', async (req, res, next) => {
  try {
    const result = await buddiesRepo.close(req.params.id);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    res.json({ message: 'Buddy post closed successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/buddies/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await buddiesRepo.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    res.json({ message: 'Buddy post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
