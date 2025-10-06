import { ObjectId } from 'mongodb';
import { getDb } from '../db/client.js';

function col() {
  return getDb().collection('reservations');
}

async function findByDate(courtId, date) {
  const query = { date };
  if (courtId) query.courtId = new ObjectId(courtId);
  return col().find(query).sort({ start: 1 }).toArray();
}

async function findById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

async function findByUser(userId) {
  return col().find({ userId: new ObjectId(userId) }).sort({ date: -1, start: 1 }).toArray();
}

async function create({ courtId, userId, date, start, end }) {
  return col().insertOne({
    courtId: new ObjectId(courtId),
    userId: new ObjectId(userId),
    date,
    start,
    end,
    status: 'booked',
    createdAt: new Date().toISOString()
  });
}

async function update(id, updateData) {
  return col().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date().toISOString() } }
  );
}

async function remove(id) {
  return col().deleteOne({ _id: new ObjectId(id) });
}

async function hasOverlap({ courtId, date, start, end, excludeId = null }) {
  const query = {
    courtId: new ObjectId(courtId),
    date,
    status: 'booked',
    $or: [
      { start: { $lt: end }, end: { $gt: start } }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: new ObjectId(excludeId) };
  }
  
  return col().findOne(query);
}

export { findByDate, findById, findByUser, create, update, remove, hasOverlap };
