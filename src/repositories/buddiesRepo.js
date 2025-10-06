import { ObjectId } from 'mongodb';
import { getDb } from '../db/client.js';

function col() {
  return getDb().collection('buddy_posts');
}

async function findAll(filters = {}) {
  const query = { isOpen: true };
  if (filters.skill) query.skill = new RegExp(filters.skill, 'i');
  
  return col().find(query).sort({ createdAt: -1 }).toArray();
}

async function findById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

async function findByUser(userId) {
  return col().find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
}

async function create({ userId, skill, availability, notes }) {
  return col().insertOne({
    userId: new ObjectId(userId),
    skill,
    availability,
    notes: notes || '',
    isOpen: true,
    createdAt: new Date().toISOString()
  });
}

async function update(id, updateData) {
  return col().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date().toISOString() } }
  );
}

async function close(id) {
  return col().updateOne(
    { _id: new ObjectId(id) },
    { $set: { isOpen: false, updatedAt: new Date().toISOString() } }
  );
}

async function remove(id) {
  return col().deleteOne({ _id: new ObjectId(id) });
}

export { findAll, findById, findByUser, create, update, close, remove };
