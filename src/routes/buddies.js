import express from 'express';
import * as buddiesRepo from '../repositories/buddiesRepo.js';
import { validateRequired, validateStringLength } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/buddies
router.get('/', async (req, res, next) => {
  try {
    const { skill, userId } = req.query;
    
    let posts;
    if (userId) {
      posts = await buddiesRepo.findByUser(userId);
    } else {
      posts = await buddiesRepo.findAll({ skill });
    }
    
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
router.post(
  '/',
  requireAuth,
  validateRequired(['skill', 'availability']),
  validateStringLength('skill', 50),
  validateStringLength('availability', 100),
  validateStringLength('notes', 500),
  async (req, res, next) => {
    try {
      const { skill, availability, notes } = req.body;

      // Use authenticated user id from token
      const userId = req.userId;

      const result = await buddiesRepo.create({
        userId,
        skill,
        availability,
        notes,
      });

      res.status(201).json({ _id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/buddies/:id
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    // Only owner can update
    const existing = await buddiesRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    if (existing.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
router.patch('/:id/close', requireAuth, async (req, res, next) => {
  try {
    const existing = await buddiesRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    if (existing.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const existing = await buddiesRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Buddy post not found' });
    }
    if (existing.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
