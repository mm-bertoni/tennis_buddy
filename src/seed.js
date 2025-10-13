// Database seeding script for sample data

import 'dotenv/config';
import { connect } from './db/client.js';
import { create } from './repositories/courtsRepo.js';
import { create as createUser } from './repositories/usersRepo.js';

// Sample data arrays
const courtNames = [
  'Court A',
  'Court B',
  'Court C',
  'Court D',
  'Court E',
  'Court F',
  'Court G',
  'Court H',
  'Court I',
  'Court J',
];
const surfaces = ['hard', 'clay', 'grass'];
const locations = [
  'Campus Recreation Center',
  'Outdoor Tennis Complex',
  'Student Union Building',
  'Downtown Sports Center',
  'Eastside Courts',
  'West End Arena',
];
const openHoures = [
  { start: '07:00', end: '22:00' },
  { start: '07:00', end: '22:00' },
  { start: '08:00', end: '20:00' },
  { start: '08:00', end: '20:00' },
  { start: '06:00', end: '23:00' },
  { start: '06:00', end: '21:00' },
];
const emails = [
  'northeastern.edu',
  'nyu.edu',
  'berkeley.edu',
  'stanford.edu',
  'mit.edu',
  'harvard.edu',
  'princeton.edu',
  'yale.edu',
];
const userNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Gabe'];
const skills = ['1.0-2.0', '2.5-3.0', '3.0-3.5', '3.5-4.0', '4.0-4.5', '4.5-5.0', '5.5+'];

// Generate database entries
const sampleCourts = [];
for (let i = 0; i < courtNames.length; i++) {
  for (let k = 0; k < surfaces.length; k++) {
    for (let j = 0; j < locations.length; j++) {
      for (let l = 0; l < openHoures.length; l++) {
        sampleCourts.push({
          name: courtNames[i],
          surface: surfaces[k],
          location: locations[j],
          openHours: openHoures[l],
        });
      }
    }
  }
}

const sampleUsers = [];
for (let i = 0; i < userNames.length; i++) {
  for (let l = 0; l < userNames.length; l++) {
    for (let j = 0; j < emails.length; j++) {
      for (let k = 0; k < skills.length; k++) {
        sampleUsers.push({
          name: userNames[i] + ' ' + userNames[l],
          email: `${userNames[i].toLowerCase()}.${userNames[l].toLowerCase()}@${emails[j]}`,
          skill: skills[k],
        });
      }
    }
  }
}

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const DB_NAME = process.env.DB_NAME || 'tennis_buddy';

    console.log('🌱 Starting database seeding...');

    // Connect to database
    const db = await connect(MONGO_URI, DB_NAME);

    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing sample data...');
    await db.collection('courts').deleteMany({});
    await db.collection('users').deleteMany({ email: { $regex: /@university\.edu$/ } });
    await db.collection('buddy_posts').deleteMany({});
    await db.collection('reservations').deleteMany({});

    // Seed courts
    console.log('🏟️ Seeding courts...');
    for (const court of sampleCourts) {
      await create(court);
    }

    // Seed users
    console.log('👥 Seeding users...');
    for (const user of sampleUsers) {
      await createUser(user);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded ${sampleCourts.length} courts and ${sampleUsers.length} users`);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
