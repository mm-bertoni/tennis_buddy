import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as usersRepo from '../repositories/usersRepo.js';
import { validateRequired, validateEmail } from '../middleware/validate.js';
import { createAuthRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/v1/auth/signup
router.post(
  '/signup',
  createAuthRateLimit(),
  validateRequired(['email', 'name', 'skill', 'password']),
  validateEmail('email'),
  async (req, res, next) => {
    try {
      const { email, name, skill, password } = req.body;

      // Check if email already registered
      const existing = await usersRepo.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'Email already registered.' });

      // Create new user
      const result = await usersRepo.create({ email, name, skill, password });

      // Create JWT
      const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({ token, userId: result.insertedId });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/login
router.post(
  '/login',
  createAuthRateLimit(),
  validateRequired(['email', 'password']),
  validateEmail('email'),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await usersRepo.findByEmail(email);

      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ error: 'Invalid email or password' });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ token, userId: user._id });
    } catch (err) {
      next(err);
    }
  }
);
