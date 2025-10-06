import express from 'express';
import * as courtsRepo from '../repositories/courtsRepo.js';
import { validateRequired, validateStringLength } from '../middleware/validate.js';

const router = express.Router();

// GET /api/v1/courts
router.get('/', async (req, res, next) => {
  try {
    const { surface, location } = req.query;
    const courts = await courtsRepo.findAll({ surface, location });
    res.json(courts);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/courts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const court = await courtsRepo.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    res.json(court);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/courts (admin/seed)
router.post('/',
  validateRequired(['name', 'surface', 'location']),
  validateStringLength('name', 100),
  validateStringLength('location', 100),
  async (req, res, next) => {
    try {
      const { name, surface, location, openHours } = req.body;
      const result = await courtsRepo.create({
        name,
        surface,
        location,
        openHours: openHours || { start: '07:00', end: '22:00' }
      });
      res.status(201).json({ _id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/courts/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await courtsRepo.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    res.json({ message: 'Court updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/courts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await courtsRepo.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
