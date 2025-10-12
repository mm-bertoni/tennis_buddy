import { ObjectId } from 'mongodb';
import { getDb } from '../db/client.js';
import bcrypt from 'bcrypt';

function col() {
  return getDb().collection('users');
}

async function findByEmail(email) {
  return col().findOne({ email });
}

async function findById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

async function findAll() {
  return col().find({}).toArray();
}

async function create({ email, name, skill, password }) {
  const doc = {
    email,
    name,
    skill,
    createdAt: new Date().toISOString(),
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    doc.passwordHash = hashedPassword;
  }

  return col().insertOne(doc);
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

// Mock demo user for class demonstration
async function getDemoUser() {
  let user = await findByEmail('demo@neu.edu');
  if (!user) {
    // Create a demo user with a known demo password so login works in demos/tests.
    const result = await create({
      email: 'demo@neu.edu',
      name: 'Demo User',
      skill: '3.0-3.5',
      password: 'demopass',
    });
    user = await findById(result.insertedId);
  }
  return user;
}

export { findByEmail, findById, findAll, create, update, remove, getDemoUser };
