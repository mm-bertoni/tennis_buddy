import { ObjectId } from 'mongodb';
import { getDb } from '../db/client.js';

function col() {
  return getDb().collection('courts');
}

async function findAll(filters = {}) {
  const query = {};
  if (filters.surface) query.surface = filters.surface;
  if (filters.location) query.location = new RegExp(filters.location, 'i');
  
  return col().find(query).toArray();
}

async function findById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

async function create(courtData) {
  return col().insertOne({
    ...courtData,
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

export { findAll, findById, create, update, remove };
