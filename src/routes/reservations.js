import express from 'express';
import * as reservationsRepo from '../repositories/reservationsRepo.js';
import * as usersRepo from '../repositories/usersRepo.js';
import { validateRequired, validateDate, validateTime, validateObjectId } from '../middleware/validate.js';

const router = express.Router();

// GET /api/v1/reservations
router.get('/', async (req, res, next) => {
  try {
    const { courtId, date, userId } = req.query;
    
    let reservations;
    if (userId) {
      reservations = await reservationsRepo.findByUser(userId);
    } else {
      reservations = await reservationsRepo.findByDate(courtId, date);
    }
    
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/reservations/:id
router.get('/:id', async (req, res, next) => {
  try {
    const reservation = await reservationsRepo.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/reservations
router.post('/',
  validateRequired(['courtId', 'date', 'start', 'end']),
  validateDate('date'),
  validateTime('start'),
  validateTime('end'),
  validateObjectId('courtId'),
  async (req, res, next) => {
    try {
      const { courtId, date, start, end } = req.body;
      
      // Get demo user for class demonstration
      const user = await usersRepo.getDemoUser();
      
      // Check for time overlap
      const overlap = await reservationsRepo.hasOverlap({ courtId, date, start, end });
      if (overlap) {
        return res.status(409).json({ 
          error: 'Time slot overlaps with an existing reservation' 
        });
      }
      
      // Validate time logic
      if (start >= end) {
        return res.status(400).json({ 
          error: 'Start time must be before end time' 
        });
      }
      
      const result = await reservationsRepo.create({
        courtId,
        userId: user._id,
        date,
        start,
        end
      });
      
      res.status(201).json({ _id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/v1/reservations/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { date, start, end } = req.body;
    
    // If updating time, check for overlap
    if (date || start || end) {
      const existing = await reservationsRepo.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Reservation not found' });
      }
      
      const overlap = await reservationsRepo.hasOverlap({
        courtId: existing.courtId,
        date: date || existing.date,
        start: start || existing.start,
        end: end || existing.end,
        excludeId: req.params.id
      });
      
      if (overlap) {
        return res.status(409).json({ 
          error: 'Updated time slot overlaps with an existing reservation' 
        });
      }
    }
    
    const result = await reservationsRepo.update(req.params.id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json({ message: 'Reservation updated successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/reservations/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await reservationsRepo.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
